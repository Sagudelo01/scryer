-- Record bans alongside picks when a game is confirmed, so the series report can
-- show the full draft of each game. Replaces draft_confirm_game from 0001.

create or replace function public.draft_confirm_game(p_code text)
returns public.rooms language plpgsql security definer set search_path = public as $$
declare
  r public.rooms;
  v_role text;
  v_cursor int;
  v_assign jsonb;
  v_types text[];
  v_teams text[];
  v_blue_picks jsonb := '[]'::jsonb;
  v_red_picks jsonb := '[]'::jsonb;
  v_blue_bans jsonb := '[]'::jsonb;
  v_red_bans jsonb := '[]'::jsonb;
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
    champ := v_assign ->> i;
    if v_types[i + 1] = 'pick' then
      if v_teams[i + 1] = 'blue' then
        v_blue_picks := v_blue_picks || to_jsonb(champ);
      else
        v_red_picks := v_red_picks || to_jsonb(champ);
      end if;
    else
      if v_teams[i + 1] = 'blue' then
        v_blue_bans := v_blue_bans || to_jsonb(champ);
      else
        v_red_bans := v_red_bans || to_jsonb(champ);
      end if;
    end if;
  end loop;
  update public.rooms
    set state = jsonb_build_object(
          'assignments', public.scryer_initial_state() -> 'assignments',
          'cursor', 0,
          'history', (r.state -> 'history') || jsonb_build_object(
            'bluePicks', v_blue_picks,
            'redPicks', v_red_picks,
            'blueBans', v_blue_bans,
            'redBans', v_red_bans
          )
        ),
        updated_at = now()
    where id = r.id
    returning * into r;
  return r;
end;
$$;
