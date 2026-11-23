"use client";

import Link from "next/link";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";
import { HelpButton } from "@/components/ui/HelpButton";
import { OnlineEntry } from "@/components/room/OnlineEntry";

export function LandingContent() {
  const { t } = useLanguage();

  const features = [
    { title: t("feature1Title"), body: t("feature1Body"), accent: "cyan" },
    { title: t("feature2Title"), body: t("feature2Body"), accent: "gold" },
    { title: t("feature3Title"), body: t("feature3Body"), accent: "blue" },
  ];

  return (
    <main className="relative overflow-hidden">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-3">
          <HelpButton />
          <LanguageToggle />
          <Link
            href="/draft"
            className="border-gold/60 bg-surface text-gold hover:border-gold hover:bg-surface-2 rounded-md border px-4 py-2 text-sm font-semibold tracking-wide transition-colors"
          >
            {t("openDraft")}
          </Link>
        </div>
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
            {t("heroKicker")}
          </p>
          <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] font-bold tracking-tight sm:text-7xl">
            {t("heroTitleA")} <span className="text-shimmer">{t("heroTitleB")}</span>
          </h1>
          <p className="text-ink-dim mt-6 max-w-2xl text-lg">{t("heroBody")}</p>
          <div className="mt-9 flex w-full flex-col items-center gap-4">
            <OnlineEntry />
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/draft"
                className="border-line bg-surface text-ink hover:border-ink-faint hover:bg-surface-2 rounded-md border px-6 py-3 text-base font-medium transition-colors"
              >
                {t("localDraft")}
              </Link>
              <a
                href="#how-it-works"
                className="border-line bg-surface text-ink-dim hover:border-ink-faint hover:text-ink rounded-md border px-6 py-3 text-base font-medium transition-colors"
              >
                {t("howItWorks")}
              </a>
            </div>
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
          <h2 className="font-display text-gold-bright text-3xl font-bold">{t("whatTitle")}</h2>
          <p className="text-ink-dim mx-auto mt-4 max-w-2xl">{t("whatBody")}</p>
          <div className="text-ink-faint mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
            <span>{t("bullet1")}</span>
            <span className="bg-ink-faint hidden h-1 w-1 rounded-full sm:block" />
            <span>{t("bullet2")}</span>
            <span className="bg-ink-faint hidden h-1 w-1 rounded-full sm:block" />
            <span>{t("bullet3")}</span>
          </div>
        </div>
      </section>

      <footer className="border-line border-t">
        <div className="text-ink-faint mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <Logo className="opacity-80" />
          <p className="max-w-md sm:text-right">{t("legal")}</p>
        </div>
      </footer>
    </main>
  );
}
