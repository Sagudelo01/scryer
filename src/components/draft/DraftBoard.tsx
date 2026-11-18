"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useDraft } from "@/hooks/useDraft";
import type { ChampionData } from "@/lib/types";
import { Logo } from "@/components/brand/Logo";
import { ChampionGrid } from "./ChampionGrid";
import { TeamColumn } from "./TeamColumn";
import { SeriesBar } from "./SeriesBar";

export function DraftBoard({ data }: { data: ChampionData }) {
  const { version, champions } = data;
  const draft = useDraft();

  const championsById = useMemo(() => new Map(champions.map((c) => [c.id, c])), [champions]);

  const current = draft.currentStep;
  const turnLabel = current
    ? `${current.team === "blue" ? "Blue" : "Red"} ${current.type === "ban" ? "Ban" : "Pick"}`
    : "Draft complete";

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <span className="border-gold/40 bg-gold/10 font-display text-gold rounded-full border px-3 py-1 text-sm font-semibold tracking-wide">
            Game {draft.gameNumber}
          </span>
          <span className="border-cyan/40 bg-cyan/10 text-cyan rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase">
            Fearless
          </span>
        </div>
      </header>

      <SeriesBar
        version={version}
        history={draft.history}
        championsById={championsById}
        lockedCount={draft.fearlessLocked.size}
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
              <span className="text-gold-bright">Draft complete — confirm to lock this game</span>
            ) : (
              <>
                On the clock:{" "}
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
            Undo
          </button>
          <button
            type="button"
            onClick={draft.resetGame}
            className="border-line text-ink-dim hover:border-ink-faint hover:text-ink rounded border px-3 py-1.5 text-xs font-medium transition-colors"
          >
            Reset game
          </button>
          {draft.isComplete && (
            <button
              type="button"
              onClick={draft.confirmGame}
              className="animate-pop border-gold bg-gold/20 text-gold-bright hover:bg-gold/30 rounded border px-4 py-1.5 text-xs font-bold tracking-wide transition-colors"
            >
              Confirm game →
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
          Patch {version} · Champion data from Riot Data Dragon. Scryer is not endorsed by Riot
          Games.
        </p>
        <button
          type="button"
          onClick={draft.resetSeries}
          className="border-line text-ink-dim hover:border-red-side/60 hover:text-red-side rounded border px-3 py-1.5 font-medium transition-colors"
        >
          Reset series
        </button>
      </footer>
    </div>
  );
}
