"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { championIconUrl } from "@/lib/ddragon";
import { CHAMPION_ROLES } from "@/lib/draft-sequence";
import { championName, roleLabel } from "@/lib/i18n";
import type { Champion } from "@/lib/types";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface ChampionGridProps {
  champions: Champion[];
  version: string;
  isUnavailable: (championId: string) => boolean;
  isFearlessLocked: (championId: string) => boolean;
  disabled: boolean;
  onSelect: (championId: string) => void;
  /** Rival mains flagged as ban targets from scouting. */
  highlighted?: Set<string>;
}

export function ChampionGrid({
  champions,
  version,
  isUnavailable,
  isFearlessLocked,
  disabled,
  onSelect,
  highlighted,
}: ChampionGridProps) {
  const { locale, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return champions
      .filter((c) => {
        const matchesQuery = q === "" || championName(c, locale).toLowerCase().includes(q);
        const matchesRole = role === null || c.tags.includes(role);
        return matchesQuery && matchesRole;
      })
      .sort((a, b) => championName(a, locale).localeCompare(championName(b, locale), locale));
  }, [champions, query, role, locale]);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <svg
            className="text-ink-faint pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchChampion")}
            aria-label={t("searchChampion")}
            className="border-line bg-void/70 text-ink placeholder:text-ink-faint focus:border-cyan/60 w-full rounded-md border py-2.5 pr-3 pl-9 text-sm transition-colors outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <RoleChip active={role === null} onClick={() => setRole(null)} label={t("roleAll")} />
          {CHAMPION_ROLES.map((r) => (
            <RoleChip
              key={r}
              active={role === r}
              onClick={() => setRole(r)}
              label={roleLabel(locale, r)}
            />
          ))}
        </div>
      </div>

      <div className="thin-scroll -mr-1 grid h-[min(60vh,620px)] auto-rows-min grid-cols-3 gap-3 overflow-y-auto pr-1 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6">
        {filtered.map((champion) => {
          const name = championName(champion, locale);
          const unavailable = isUnavailable(champion.id);
          const fearless = isFearlessLocked(champion.id);
          const marked = highlighted?.has(champion.id) ?? false;
          return (
            <button
              key={champion.id}
              type="button"
              disabled={unavailable || disabled}
              onClick={() => onSelect(champion.id)}
              title={fearless ? `${name} — ${t("usedEarlier")}` : name}
              className={`group flex flex-col items-center gap-1.5 rounded-lg p-1.5 transition-colors ${
                unavailable
                  ? "cursor-not-allowed"
                  : "hover:bg-surface-2/60 cursor-pointer disabled:cursor-not-allowed"
              } ${disabled && !unavailable ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <span
                className={`relative aspect-square w-full overflow-hidden rounded-md border transition-all duration-150 ${
                  marked && !unavailable ? "ring-red-side/80 ring-2" : ""
                } ${
                  unavailable
                    ? "border-line/60"
                    : "border-line group-hover:border-gold group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_22px_-8px_rgba(200,170,110,0.65)]"
                }`}
              >
                <Image
                  src={championIconUrl(version, champion.id)}
                  alt={name}
                  width={120}
                  height={120}
                  unoptimized
                  className={`h-full w-full object-cover transition-transform duration-200 ${
                    unavailable ? "grayscale" : "group-hover:scale-105"
                  }`}
                />
                {unavailable && <span className="bg-abyss/65 absolute inset-0" />}
                {marked && !unavailable && (
                  <span
                    className="bg-abyss/80 text-red-side absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <circle cx="12" cy="12" r="8" />
                      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
                    </svg>
                  </span>
                )}
                {fearless && (
                  <span
                    className="bg-abyss/80 text-gold absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                      <path d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5Zm3 8H9V6a3 3 0 0 1 6 0v3Z" />
                    </svg>
                  </span>
                )}
              </span>
              <span
                className={`w-full truncate text-center text-xs leading-tight ${
                  unavailable ? "text-ink-faint" : "text-ink-dim group-hover:text-ink"
                }`}
              >
                {name}
              </span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-ink-faint col-span-full py-10 text-center text-sm">{t("noMatches")}</p>
        )}
      </div>
    </div>
  );
}

function RoleChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-cyan/70 bg-cyan/15 text-cyan"
          : "border-line text-ink-dim hover:border-ink-faint hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
