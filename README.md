# Scryer

[![CI](https://github.com/Sagudelo01/scryer/actions/workflows/ci.yml/badge.svg)](https://github.com/Sagudelo01/scryer/actions/workflows/ci.yml)

Scryer is a Fearless Draft simulator and live scouting tool for the amateur
competitive League of Legends scene. It gives community tournaments, scrim
teams and aspiring coaches a pro-style draft room where a full best-of series
can be drafted in one place, with the Fearless ruleset enforced automatically.

The name comes from "scry" — to see what is hidden, in advance. That is the
heart of the project: reading the draft before it happens.

## What it does

- **Fearless Draft board.** Draft a full series using the standard competitive
  ban and pick order. Every champion picked in an earlier game of the series is
  locked out and cannot be picked again, exactly like a Fearless series.
- **Live rooms.** Create a room with a short code and share the link. Two
  captains draft in real time while spectators watch read-only, synced through
  Supabase Realtime. The current turn, picks, bans and Fearless locks stay in
  step for everyone, and the local board keeps working with no setup.
- **Rival scouting.** Enter a rival's Riot ID and region to see their most
  mastered champions, enriched with win rate and games from their recent
  matches. Flag their mains as ban targets and they are highlighted right in the
  draft grid. The Riot key stays on the server.
- **Series tracking.** Confirm a game to lock its picks and move on to the next
  one. The running pool of used champions is shown at all times.
- **Champion grid.** Search by name and filter by role, with live champion data
  and square portraits pulled from Riot's Data Dragon and cached on the server.
- **English and Spanish.** A language switch in the header translates both the
  interface and the champion names, loading the matching Data Dragon locale. The
  choice is saved and defaults to the browser language.
- **Responsive, competitive design.** A dark hextech-inspired interface that
  works from phone to ultrawide.

## Planned

Later phases add report exports for coaches and private tournament rooms.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) and TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) (Postgres and Realtime) for live rooms and
  anonymous authentication
- [Zod](https://zod.dev) for validating external data and draft state
- [Vitest](https://vitest.dev) for unit tests
- Riot [Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon) for
  champion data and images, and the Riot Games API (Account-V1,
  Champion-Mastery-V4, Match-V5) for scouting
- Deployed on [Vercel](https://vercel.com)

## Getting started

Requirements: Node.js 20 or newer and npm.

```bash
# install dependencies
npm install

# run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The local
draft board lives at [http://localhost:3000/draft](http://localhost:3000/draft)
and needs no configuration.

## Live rooms (Supabase)

Live rooms are optional. The local board works without any of this; the steps
below only enable real-time multiplayer.

1. Create a project at [supabase.com](https://supabase.com).
2. In Authentication > Sign In / Providers, enable **Anonymous sign-ins**.
3. In the SQL Editor, run the migration in
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql). It
   creates the `rooms` table, enables row level security and installs the
   authoritative draft functions, and adds the table to the realtime
   publication.
4. Copy `.env.example` to `.env.local` and fill in the values from Project
   Settings > API:

   ```bash
   cp .env.example .env.local
   ```

   - `NEXT_PUBLIC_SUPABASE_URL` — the Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the anon public key

5. For deployment, add the same two variables in the Vercel project settings
   (Production, Preview and Development) and redeploy.

Every draft mutation goes through `SECURITY DEFINER` database functions that
check turn ownership and the Fearless rule, so only the captain whose turn it is
can act. Row level security blocks direct writes to the table.

## Scouting (Riot API)

Scouting is optional too. The draft and rooms work without it.

1. Sign in at [developer.riotgames.com](https://developer.riotgames.com) and
   generate a development API key.
2. Add it to `.env.local`:

   ```bash
   RIOT_API_KEY=RGAPI-your-development-key
   ```

3. For deployment, add `RIOT_API_KEY` in the Vercel project settings and
   redeploy.

The key is read only inside the server route handler at `src/app/api/scouting`
and is never sent to the browser. Responses are cached with sensible TTLs, the
client's request rate is limited, and rate-limit (429) responses are retried
using the `Retry-After` header. A development key is enough to try scouting; a
production key raises the limits.

Other scripts:

```bash
npm run build       # production build
npm run start       # run the production build
npm run lint        # lint the project
npm run typecheck   # type-check without emitting
npm test            # run the unit tests
```

## Quality

The draft logic lives in a pure, framework-agnostic engine
(`src/lib/draft-engine.ts`), the room turn and permission rules in
`src/lib/room.ts`, and the scouting aggregation in `src/lib/scouting.ts`, all
covered by Vitest. External Data Dragon and Riot API responses, the draft state
and the data returned by Supabase are validated with Zod. Every push and pull
request runs lint, type-check, tests and a production build through GitHub
Actions.

## Legal

Scryer is not endorsed by Riot Games and does not reflect the views or opinions
of Riot Games or anyone officially involved in producing or managing League of
Legends. League of Legends and Riot Games are trademarks or registered
trademarks of Riot Games, Inc. League of Legends is a copyright of Riot Games,
Inc.

Champion data and images are provided through Riot's Data Dragon static data
service. No Riot Games logos or branding are used in this project.

## License

Released under the [MIT License](LICENSE).
