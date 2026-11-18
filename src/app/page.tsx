import Link from "next/link";
import { Logo, LogoMark } from "@/components/brand/Logo";

const features = [
  {
    title: "Fearless Draft engine",
    body: "Draft a full best-of series with the standard tournament ban and pick order. Every champion picked in an earlier game is locked out for the rest of the series.",
    accent: "cyan",
  },
  {
    title: "Live scouting",
    body: "As the draft unfolds, surface which available champions the opposing players have real mastery on. See what is hidden before it is picked.",
    accent: "gold",
  },
  {
    title: "Built for amateurs",
    body: "Made for the grassroots competitive scene: community tournaments, scrim blocks and aspiring coaches who want a pro-level draft room for free.",
    accent: "blue",
  },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <Link
          href="/draft"
          className="border-gold/50 bg-gold/10 text-gold hover:bg-gold/20 rounded-md border px-4 py-2 text-sm font-semibold tracking-wide transition-colors"
        >
          Open draft room
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-24 text-center sm:pt-24">
        <div
          className="pointer-events-none absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #0ac8b9, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="animate-rise relative flex flex-col items-center">
          <LogoMark className="h-16 w-16" />
          <p className="border-line bg-surface/60 text-ink-dim mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium tracking-[0.2em] uppercase">
            Fearless Draft · Live Scouting
          </p>
          <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] font-bold tracking-tight sm:text-7xl">
            See the draft <span className="text-shimmer">before it happens</span>
          </h1>
          <p className="text-ink-dim mt-6 max-w-2xl text-lg">
            Scryer is a Fearless Draft simulator and scouting tool for the amateur competitive
            League of Legends scene. Run a full best-of series in a pro-style draft room and keep
            every pick honest across games.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/draft"
              className="group border-gold bg-gold/20 font-display text-gold-bright hover:bg-gold/30 rounded-md border px-6 py-3 text-base font-bold tracking-wide transition-all hover:shadow-[0_8px_30px_-8px_rgba(200,170,110,0.7)]"
            >
              Start a Fearless draft
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <a
              href="#how-it-works"
              className="border-line text-ink-dim hover:border-ink-faint hover:text-ink rounded-md border px-6 py-3 text-base font-medium transition-colors"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="hex-panel hex-clip group rounded-lg p-6 transition-transform hover:-translate-y-1"
            >
              <span
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md ${
                  f.accent === "cyan"
                    ? "bg-cyan/15 text-cyan"
                    : f.accent === "gold"
                      ? "bg-gold/15 text-gold"
                      : "bg-blue-side/15 text-blue-side"
                }`}
                aria-hidden="true"
              >
                <span className="h-3 w-3 rotate-45 bg-current" />
              </span>
              <h3 className="font-display text-ink text-xl font-bold">{f.title}</h3>
              <p className="text-ink-dim mt-2 text-sm leading-relaxed">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* What is Fearless */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="hex-panel hex-clip rounded-lg p-8 text-center sm:p-12">
          <h2 className="font-display text-gold-bright text-3xl font-bold">
            What is Fearless Draft?
          </h2>
          <p className="text-ink-dim mx-auto mt-4 max-w-2xl">
            In a Fearless series, a champion that has been picked in any earlier game can no longer
            be picked again. Teams burn through their comfort picks fast, forcing deep champion
            pools and fresh drafts every game. Scryer tracks the locked pool for you and keeps the
            whole series in one draft room.
          </p>
          <div className="text-ink-faint mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
            <span>Standard tournament ban/pick order</span>
            <span className="bg-ink-faint hidden h-1 w-1 rounded-full sm:block" />
            <span>Multi-game series tracking</span>
            <span className="bg-ink-faint hidden h-1 w-1 rounded-full sm:block" />
            <span>Live champion data from Data Dragon</span>
          </div>
        </div>
      </section>

      <footer className="border-line border-t">
        <div className="text-ink-faint mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <Logo className="opacity-80" />
          <p className="max-w-md sm:text-right">
            Scryer is not endorsed by Riot Games and does not reflect the views or opinions of Riot
            Games or anyone officially involved in producing or managing League of Legends.
          </p>
        </div>
      </footer>
    </main>
  );
}
