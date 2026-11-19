"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useDraft } from "@/hooks/useDraft";
import { useBanTargets } from "@/hooks/useBanTargets";
import type { ChampionData } from "@/lib/types";
import { Logo } from "@/components/brand/Logo";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";
import { ScoutingPanel } from "@/components/scouting/ScoutingPanel";
import { ChampionGrid } from "./ChampionGrid";
import { TeamColumn } from "./TeamColumn";
import { SeriesBar } from "./SeriesBar";
import { ReserveTracker } from "./ReserveTracker";

export function DraftBoard({ data }: { data: ChampionData }) {
  const { version, champions } = data;
  const { t } = useLanguage();
  const draft = useDraft();
  const bans = useBanTargets();

  const championsById = useMemo(() => new Map(champions.map((c) => [c.id, c])), [champions]);
  const unavailable = useMemo(
    () => new Set([...draft.fearlessLocked, ...draft.usedThisGame]),
    [draft.fearlessLocked, draft.usedThisGame],
  );

  const current = draft.currentStep;
  const turnLabel = current
    ? `${current.team === "blue" ? t("blueShort") : t("redShort")} ${
        current.type === "ban" ? t("ban") : t("pick")
      }`
    : "";

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <span className="border-gold/40 bg-gold/10 font-display text-gold rounded-full border px-3 py-1 text-sm font-semibold tracking-wide">
            {t("game")} {draft.gameNumber}
          </span>
          <span className="border-cyan/40 bg-cyan/10 text-cyan rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase">
            {t("fearless")}
          </span>
        </div>
      </header>

      <SeriesBar
        version={version}
        history={draft.history}
        championsById={championsById}
        lockedCount={draft.fearlessLocked.size}
      />

      <ReserveTracker champions={champions} unavailable={unavailable} />

      <ScoutingPanel
        champions={champions}
        version={version}
        marked={bans.banTargets}
        onToggle={bans.toggle}
        onMarkAll={bans.markAll}
        onClear={bans.clear}
      />

      {/* Turn indicator */}
      <div
        className={`flex items-center justify-between gap-4 rounded-md border px-4 py-3 transition-colors ${
          draft.isComplete
            ? "border-gold/50 bg-gold/10"
            : current?.team === "blue"
              ? "border-blue-side/50 bg-blue-side/10"
              : "border-red-side/50 bg-red-side/10"
        }`}
      >
        <div className="flex items-center gap-3">
          {!draft.isComplete && (
            <span
              className={`animate-glow h-3 w-3 rounded-full ${
                current?.team === "blue" ? "bg-blue-side" : "bg-red-side"
              }`}
            />
          )}
          <p className="font-display text-base font-semibold tracking-wide">
            {draft.isComplete ? (
              <span className="text-gold-bright">{t("draftComplete")}</span>
            ) : (
              <>
                {t("onTheClock")}{" "}
                <span className={current?.team === "blue" ? "text-blue-side" : "text-red-side"}>
                  {turnLabel}
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={draft.undo}
            disabled={draft.cursor === 0}
            className="border-line text-ink-dim hover:border-ink-faint hover:text-ink rounded border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("undo")}
          </button>
          <button
            type="button"
            onClick={draft.resetGame}
            className="border-line text-ink-dim hover:border-ink-faint hover:text-ink rounded border px-3 py-1.5 text-xs font-medium transition-colors"
          >
            {t("resetGame")}
          </button>
          {draft.isComplete && (
            <button
              type="button"
              onClick={draft.confirmGame}
              className="animate-pop border-gold bg-gold/20 text-gold-bright hover:bg-gold/30 rounded border px-4 py-1.5 text-xs font-bold tracking-wide transition-colors"
            >
              {t("confirmGame")} →
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)_minmax(0,1fr)]">
        <TeamColumn
          team="blue"
          version={version}
          championsById={championsById}
          getAssignment={draft.getAssignment}
          isActiveSlot={draft.isActiveSlot}
          align="left"
        />

        <div className="order-first lg:order-none">
          <ChampionGrid
            champions={champions}
            version={version}
            isUnavailable={draft.isUnavailable}
            isFearlessLocked={(id) => draft.fearlessLocked.has(id)}
            disabled={draft.isComplete}
            onSelect={draft.select}
            highlighted={bans.banTargets}
          />
        </div>

        <TeamColumn
          team="red"
          version={version}
          championsById={championsById}
          getAssignment={draft.getAssignment}
          isActiveSlot={draft.isActiveSlot}
          align="right"
        />
      </div>

      <footer className="border-line text-ink-faint flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-xs">
        <p>
          {t("patch")} {version} · {t("footerData")}
        </p>
        <button
          type="button"
          onClick={draft.resetSeries}
          className="border-line text-ink-dim hover:border-red-side/60 hover:text-red-side rounded border px-3 py-1.5 font-medium transition-colors"
        >
          {t("resetSeries")}
        </button>
      </footer>
    </div>
  );
}
