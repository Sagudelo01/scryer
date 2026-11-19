"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const DURATIONS = [20, 30, 45, 60];

interface TurnTimerProps {
  /** Changes whenever the active turn changes; resets the countdown. */
  turnKey: number;
  /** Whether the countdown should run (drafting and not complete). */
  active: boolean;
}

export function TurnTimer({ turnKey, active }: TurnTimerProps) {
  const { t } = useLanguage();
  const [enabled, setEnabled] = useState(false);
  const [seconds, setSeconds] = useState(30);

  if (!enabled) {
    return (
      <button
        type="button"
        onClick={() => setEnabled(true)}
        title={t("timerHint")}
        className="border-line text-ink-dim hover:border-ink-faint hover:text-ink rounded border px-3 py-1.5 text-xs font-medium transition-colors"
      >
        {t("turnTimer")}
      </button>
    );
  }

  return (
    <div
      className="border-line flex items-center gap-2 rounded border px-2 py-1"
      title={t("timerHint")}
    >
      <select
        value={seconds}
        onChange={(e) => setSeconds(Number(e.target.value))}
        aria-label={t("turnTimer")}
        className="bg-void/70 text-ink-dim rounded px-1 py-0.5 text-xs outline-none"
      >
        {DURATIONS.map((d) => (
          <option key={d} value={d} className="bg-surface">
            {d}s
          </option>
        ))}
      </select>
      {/* Remount on each turn or duration change to reset the countdown. */}
      <Countdown key={`${turnKey}:${seconds}`} seconds={seconds} active={active} />
      <button
        type="button"
        onClick={() => setEnabled(false)}
        aria-label={t("turnTimer")}
        className="text-ink-faint hover:text-ink text-xs transition-colors"
      >
        ×
      </button>
    </div>
  );
}

function Countdown({ seconds, active }: { seconds: number; active: boolean }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setRemaining((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  const warning = active && remaining <= 5 && remaining > 0;
  const done = active && remaining === 0;

  return (
    <span
      className={`font-display min-w-[2.5ch] text-center text-sm font-bold tabular-nums ${
        done ? "text-red-side" : warning ? "text-red-side animate-glow" : "text-ink"
      }`}
    >
      {remaining}
    </span>
  );
}
