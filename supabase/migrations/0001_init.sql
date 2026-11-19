-- Scryer realtime rooms: schema, row level security and authoritative draft logic.
-- All draft mutations go through SECURITY DEFINER functions that enforce turn
-- ownership and the Fearless rule, so the UI can never be the only gate.

create extension if not exists pgcrypto;

-- Draft turn order (20 steps). Index i (1-based) is the team acting at cursor i-1.
-- Keep this in sync with src/lib/draft-sequence.ts.
create or replace function public.scryer_turn_order()
returns text[] language sql immutable as $$
  select array[
    'blue','red','blue','red','blue','red',
    'blue','red','red','blue','blue','red',
    'red','blue','red','blue',
    'red','blue','blue','red'
  ];
$$;

create or replace function public.scryer_turn_types()
returns text[] language sql immutable as $$
  select array[
    'ban','ban','ban','ban','ban','ban',
    'pick','pick','pick','pick','pick','pick',
    'ban','ban','ban','ban',
    'pick','pick','pick','pick'
  ];
$$;

create or replace function public.scryer_initial_state()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'assignments', (select jsonb_agg(v) from (select null::text as v from generate_series(1, 20)) s),
    'cursor', 0,
    'history', '[]'::jsonb
  );
$$;

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  status text not null default 'waiting' check (status in ('waiting', 'drafting', 'complete')),
  blue_captain uuid references auth.users (id) on delete set null,
  red_captain uuid references auth.users (id) on delete set null,
  state jsonb not null default public.scryer_initial_state(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rooms_code_idx on public.rooms (code);

alter table public.rooms enable row level security;

-- Anyone (including anonymous spectators) may read a room; the short code is the
-- shared secret. No direct insert/update/delete policies exist, so every write
-- must go through the definer functions below.
drop policy if exists rooms_select on public.rooms;
create policy rooms_select on public.rooms for select using (true);

-- Broadcast row changes over Supabase Realtime.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'rooms'
  ) then
    alter publication supabase_realtime add table public.rooms;
  end if;
end;
$$;

create or replace function public.scryer_caller_role(p_room public.rooms)
returns text language sql stable as $$
  select case
    when auth.uid() is not null and auth.uid() = p_room.blue_captain then 'blue'
    when auth.uid() is not null and auth.uid() = p_room.red_captain then 'red'
    else 'spectator'
  end;
$$;

create or replace function public.scryer_generate_code()
returns text language plpgsql as $$
declare
  alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  candidate text;
  i int;
begin
  loop
    candidate := '';
    for i in 1..6 loop
      candidate := candidate || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.rooms where code = candidate);
  end loop;
  return candidate;
end;
$$;

create or replace function public.create_room()
returns public.rooms language plpgsql security definer set search_path = public as $$
declare
  r public.rooms;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;
  insert into public.rooms (code, status, blue_captain)
  values (public.scryer_generate_code(), 'waiting', auth.uid())
  returning * into r;
  return r;
end;
$$;

create or replace function public.join_room(p_code text)
returns public.rooms language plpgsql security definer set search_path = public as $$
declare
  r public.rooms;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;
  select * into r from public.rooms where code = p_code for update;
  if not found then
    raise exception 'room not found';
  end if;
  if r.blue_captain is distinct from auth.uid()
     and r.red_captain is null
     and r.blue_captain is not null then
    update public.rooms
      set red_captain = auth.uid(),
          status = 'drafting',
          updated_at = now()
      where id = r.id
      returning * into r;
  end if;
  return r;
end;
$$;

create or replace function public.draft_select(p_code text, p_champion text)
returns public.rooms language plpgsql security definer set search_path = public as $$
declare
  r public.rooms;
  v_role text;
  v_cursor int;
  v_assign jsonb;
  v_turn text;
begin
  select * into r from public.rooms where code = p_code for update;
  if not found then
    raise exception 'room not found';
  end if;
  if r.status <> 'drafting' then
    raise exception 'room is not drafting';
  end if;
  v_role := public.scryer_caller_role(r);
  if v_role = 'spectator' then
    raise exception 'only captains can act';
  end if;
  v_cursor := (r.state ->> 'cursor')::int;
  if v_cursor >= 20 then
    raise exception 'draft already complete';
  end if;
  v_turn := (public.scryer_turn_order())[v_cursor + 1];
  if v_role <> v_turn then
    raise exception 'not your turn';
  end if;
  v_assign := r.state -> 'assignments';
  if exists (
    select 1 from jsonb_array_elements_text(v_assign) e where e = p_champion
  ) then
    raise exception 'champion already used this game';
  end if;
  if exists (
    select 1
    from jsonb_array_elements(r.state -> 'history') g
    cross join lateral (
      select jsonb_array_elements_text(g -> 'bluePicks') as pick
      union all
      select jsonb_array_elements_text(g -> 'redPicks')
    ) picks
    where picks.pick = p_champion
  ) then
    raise exception 'champion locked by Fearless rule';
  end if;
  v_assign := jsonb_set(v_assign, array[v_cursor::text], to_jsonb(p_champion));
  update public.rooms
    set state = jsonb_set(jsonb_set(r.state, '{assignments}', v_assign), '{cursor}', to_jsonb(v_cursor + 1)),
        updated_at = now()
    where id = r.id
    returning * into r;
  return r;
end;
$$;

create or replace function public.draft_undo(p_code text)
returns public.rooms language plpgsql security definer set search_path = public as $$
declare
  r public.rooms;
  v_role text;
  v_cursor int;
  v_assign jsonb;
begin
  select * into r from public.rooms where code = p_code for update;
  if not found then
    raise exception 'room not found';
  end if;
  v_role := public.scryer_caller_role(r);
  if v_role = 'spectator' then
    raise exception 'only captains can act';
  end if;
  v_cursor := (r.state ->> 'cursor')::int;
  if v_cursor = 0 then
    return r;
  end if;
  v_assign := jsonb_set(r.state -> 'assignments', array[(v_cursor - 1)::text], 'null'::jsonb);
  update public.rooms
    set state = jsonb_set(jsonb_set(r.state, '{assignments}', v_assign), '{cursor}', to_jsonb(v_cursor - 1)),
        status = 'drafting',
        updated_at = now()
    where id = r.id
    returning * into r;
  return r;
end;
$$;

create or replace function public.draft_confirm_game(p_code text)
returns public.rooms language plpgsql security definer set search_path = public as $$
declare
  r public.rooms;
  v_role text;
  v_cursor int;
  v_assign jsonb;
  v_types text[];
  v_teams text[];
  v_blue jsonb := '[]'::jsonb;
  v_red jsonb := '[]'::jsonb;
  i int;
  champ text;
begin
  select * into r from public.rooms where code = p_code for update;
  if not found then
    raise exception 'room not found';
  end if;
  v_role := public.scryer_caller_role(r);
  if v_role = 'spectator' then
    raise exception 'only captains can act';
  end if;
  v_cursor := (r.state ->> 'cursor')::int;
  if v_cursor < 20 then
    raise exception 'draft not complete';
  end if;
  v_assign := r.state -> 'assignments';
  v_types := public.scryer_turn_types();
  v_teams := public.scryer_turn_order();
  for i in 0..19 loop
    if v_types[i + 1] = 'pick' then
      champ := v_assign ->> i;
      if v_teams[i + 1] = 'blue' then
        v_blue := v_blue || to_jsonb(champ);
      else
        v_red := v_red || to_jsonb(champ);
      end if;
    end if;
  end loop;
  update public.rooms
    set state = jsonb_build_object(
          'assignments', public.scryer_initial_state() -> 'assignments',
          'cursor', 0,
          'history', (r.state -> 'history') || jsonb_build_object('bluePicks', v_blue, 'redPicks', v_red)
        ),
        updated_at = now()
    where id = r.id
    returning * into r;
  return r;
end;
$$;

create or replace function public.draft_reset_game(p_code text)
returns public.rooms language plpgsql security definer set search_path = public as $$
declare
  r public.rooms;
  v_role text;
begin
  select * into r from public.rooms where code = p_code for update;
  if not found then
    raise exception 'room not found';
  end if;
  v_role := public.scryer_caller_role(r);
  if v_role = 'spectator' then
    raise exception 'only captains can act';
  end if;
  update public.rooms
    set state = jsonb_set(jsonb_set(r.state, '{assignments}', public.scryer_initial_state() -> 'assignments'), '{cursor}', '0'::jsonb),
        updated_at = now()
    where id = r.id
    returning * into r;
  return r;
end;
$$;

create or replace function public.draft_reset_series(p_code text)
returns public.rooms language plpgsql security definer set search_path = public as $$
declare
  r public.rooms;
  v_role text;
begin
  select * into r from public.rooms where code = p_code for update;
  if not found then
    raise exception 'room not found';
  end if;
  v_role := public.scryer_caller_role(r);
  if v_role = 'spectator' then
    raise exception 'only captains can act';
  end if;
  update public.rooms
    set state = public.scryer_initial_state(),
        updated_at = now()
    where id = r.id
    returning * into r;
  return r;
end;
$$;

revoke all on function public.create_room() from public;
revoke all on function public.join_room(text) from public;
revoke all on function public.draft_select(text, text) from public;
revoke all on function public.draft_undo(text) from public;
revoke all on function public.draft_confirm_game(text) from public;
revoke all on function public.draft_reset_game(text) from public;
revoke all on function public.draft_reset_series(text) from public;

grant execute on function public.create_room() to anon, authenticated;
grant execute on function public.join_room(text) to anon, authenticated;
grant execute on function public.draft_select(text, text) to anon, authenticated;
grant execute on function public.draft_undo(text) to anon, authenticated;
grant execute on function public.draft_confirm_game(text) to anon, authenticated;
grant execute on function public.draft_reset_game(text) to anon, authenticated;
grant execute on function public.draft_reset_series(text) to anon, authenticated;
