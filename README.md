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
- **Series tracking.** Confirm a game to lock its picks and move on to the next
  one. The running pool of used champions is shown at all times.
- **Champion grid.** Search by name and filter by role, with live champion data
  and icons pulled from Riot's Data Dragon and cached on the server.
- **Responsive, competitive design.** A dark hextech-inspired interface that
  works from phone to ultrawide.

## Planned

Later phases add real-time drafting across two separate rooms (Supabase
Realtime), live scouting of opponents' champion mastery (Riot Match-V5 and
Champion-Mastery APIs), report exports for coaches and private tournament rooms.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) and TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Zod](https://zod.dev) for validating external data and draft state
- [Vitest](https://vitest.dev) for unit tests
- Riot [Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon) for
  champion data and images
- Deployed on [Vercel](https://vercel.com)

Planned for later phases: [Supabase](https://supabase.com) (Postgres and
Realtime) for rooms and shared state, and the Riot Games API for scouting.

## Getting started

Requirements: Node.js 20 or newer and npm.

```bash
# install dependencies
npm install

# run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The draft
room lives at [http://localhost:3000/draft](http://localhost:3000/draft).

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
(`src/lib/draft-engine.ts`) covered by Vitest. External Data Dragon responses
and the draft state are validated with Zod. Every push and pull request runs
lint, type-check, tests and a production build through GitHub Actions.

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
