"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { championIconUrl } from "@/lib/ddragon";
import { championName, type TranslationKey } from "@/lib/i18n";
import { RIOT_REGIONS } from "@/lib/riot/regions";
import { scoutReportSchema, type ScoutReport } from "@/lib/scouting";
import type { Champion } from "@/lib/types";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface ScoutingPanelProps {
  champions: Champion[];
  version: string;
  marked: Set<string>;
  onToggle: (championId: string) => void;
  onMarkAll: (championIds: string[]) => void;
  onClear: () => void;
}

const ERROR_KEYS: Record<string, TranslationKey> = {
  not_configured: "scoutError_not_configured",
  invalid_input: "scoutError_invalid_input",
  not_found: "scoutError_not_found",
  rate_limited: "scoutError_rate_limited",
  upstream: "scoutError_upstream",
};

export function ScoutingPanel({
  champions,
  version,
  marked,
  onToggle,
  onMarkAll,
  onClear,
}: ScoutingPanelProps) {
  const { locale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [riotId, setRiotId] = useState("");
  const [region, setRegion] = useState(RIOT_REGIONS[0].id);
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);
  const [report, setReport] = useState<ScoutReport | null>(null);

  const championsByKey = useMemo(() => new Map(champions.map((c) => [c.key, c])), [champions]);

  const scout = async () => {
    setLoading(true);
    setErrorKey(null);
    try {
      const params = new URLSearchParams({ riotId, region });
      const res = await fetch(`/api/scouting?${params.toString()}`);
      const body = await res.json();
      if (!res.ok) {
        setReport(null);
        setErrorKey(ERROR_KEYS[body?.error] ?? "scoutError_upstream");
        return;
      }
      setReport(scoutReportSchema.parse(body));
    } catch {
      setReport(null);
      setErrorKey("scoutError_upstream");
    } finally {
      setLoading(false);
    }
  };

  const resolved = useMemo(() => {
    if (!report) return [];
    return report.champions
      .map((c) => ({ scout: c, champion: championsByKey.get(c.championKey) }))
      .filter((row): row is { scout: (typeof report.champions)[number]; champion: Champion } =>
        Boolean(row.champion),
      );
  }, [report, championsByKey]);

  return (
    <div className="hex-panel hex-clip rounded-md">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-display text-gold text-sm font-semibold tracking-wide">
          {t("rivalScouting")}
        </span>
        <span className="text-ink-faint flex items-center gap-2 text-xs">
          {marked.size > 0 && (
            <span className="text-red-side">
              {marked.size} {t("banTargets")}
            </span>
          )}
          <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
        </span>
      </button>

      {open && (
        <div className="border-line flex flex-col gap-4 border-t px-4 py-4">
          <p className="text-ink-dim text-sm">{t("scoutingHint")}</p>

          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={riotId}
              onChange={(e) => setRiotId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && scout()}
              placeholder={t("riotIdPlaceholder")}
              aria-label={t("riotIdPlaceholder")}
              className="border-line bg-void/70 text-ink placeholder:text-ink-faint focus:border-cyan/60 min-w-[200px] flex-1 rounded-md border px-3 py-2 text-sm outline-none"
            />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              aria-label={t("regionLabel")}
              className="border-line bg-void/70 text-ink focus:border-cyan/60 rounded-md border px-3 py-2 text-sm outline-none"
            >
              {RIOT_REGIONS.map((r) => (
                <option key={r.id} value={r.id} className="bg-surface">
                  {r.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={scout}
              disabled={loading}
              className="border-gold bg-gold/20 text-gold-bright hover:bg-gold/30 rounded-md border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {loading ? t("scoutingLoading") : t("scout")}
            </button>
          </div>

          {errorKey && (
            <p className="border-red-side/50 bg-red-side/10 text-red-side rounded-md border px-3 py-2 text-xs">
              {t(errorKey)}
            </p>
          )}

          {report && resolved.length === 0 && !errorKey && (
            <p className="text-ink-faint text-sm">{t("noMasteryData")}</p>
          )}

          {resolved.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-ink-dim text-xs">{report?.riotId}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onMarkAll(resolved.map((r) => r.champion.id))}
                    className="border-line text-ink-dim hover:text-ink rounded border px-2.5 py-1 text-xs transition-colors"
                  >
                    {t("markAllBans")}
                  </button>
                  <button
                    type="button"
                    onClick={onClear}
                    className="border-line text-ink-dim hover:text-ink rounded border px-2.5 py-1 text-xs transition-colors"
                  >
                    {t("clearMarks")}
                  </button>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {resolved.map(({ scout: s, champion }) => {
                  const isMarked = marked.has(champion.id);
                  return (
                    <div
                      key={champion.id}
                      className="border-line bg-void/50 flex items-center gap-3 rounded-md border p-2"
                    >
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded">
                        <Image
                          src={championIconUrl(version, champion.id)}
                          alt={championName(champion, locale)}
                          width={44}
                          height={44}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-ink truncate text-sm font-semibold">
                          {championName(champion, locale)}
                        </p>
                        <p className="text-ink-faint text-[11px]">
                          {t("mastery")} {s.masteryLevel} · {s.masteryPoints.toLocaleString(locale)}{" "}
                          {t("masteryPoints")} · {s.recentGames} {t("recentGamesLabel")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggle(champion.id)}
                        aria-pressed={isMarked}
                        className={`shrink-0 rounded border px-2.5 py-1 text-xs font-medium transition-colors ${
                          isMarked
                            ? "border-red-side bg-red-side/20 text-red-side"
                            : "border-line text-ink-dim hover:text-ink"
                        }`}
                      >
                        {isMarked ? t("marked") : t("markForBan")}
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="text-ink-faint text-[11px]">{t("legal")}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
