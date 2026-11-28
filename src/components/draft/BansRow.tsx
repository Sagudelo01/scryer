"use client";

import Image from "next/image";
import { championIconUrl } from "@/lib/ddragon";
import { BANS_PER_TEAM } from "@/lib/draft-sequence";
import { championName } from "@/lib/i18n";
import type { Champion, Team } from "@/lib/types";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface BansRowProps {
  version: string;
  championsById: Map<string, Champion>;
  getAssignment: (team: Team, type: "ban" | "pick", slot: number) => string | null;
  isActiveSlot: (team: Team, type: "ban" | "pick", slot: number) => boolean;
}

export function BansRow({ version, championsById, getAssignment, isActiveSlot }: BansRowProps) {
  const { t } = useLanguage();
  return (
    <div
      className="hex-panel hex-clip flex items-center justify-between gap-3 rounded-md px-3 py-2.5 sm:px-4"
      role="group"
      aria-label={t("bansLabel")}
    >
      <BanSet
        team="blue"
        version={version}
        championsById={championsById}
        getAssignment={getAssignment}
        isActiveSlot={isActiveSlot}
      />
      <span className="text-ink-faint font-display shrink-0 text-[11px] font-semibold tracking-[0.25em] uppercase">
        {t("bansLabel")}
      </span>
      <BanSet
        team="red"
        version={version}
        championsById={championsById}
        getAssignment={getAssignment}
        isActiveSlot={isActiveSlot}
        reverse
      />
    </div>
  );
}

function BanSet({
  team,
  version,
  championsById,
  getAssignment,
  isActiveSlot,
  reverse = false,
}: BansRowProps & { team: Team; reverse?: boolean }) {
  const { locale, t } = useLanguage();
  const isBlue = team === "blue";
  const activeRing = isBlue
    ? "border-blue-side shadow-[0_0_14px_-3px_rgba(74,140,255,0.85)]"
    : "border-red-side shadow-[0_0_14px_-3px_rgba(255,85,85,0.85)]";

  return (
    <div className={`flex gap-1.5 ${reverse ? "flex-row-reverse" : ""}`}>
      {Array.from({ length: BANS_PER_TEAM }).map((_, slot) => {
        const id = getAssignment(team, "ban", slot);
        const champion = id ? championsById.get(id) : null;
        const name = champion ? championName(champion, locale) : "";
        const active = isActiveSlot(team, "ban", slot);
        const state = champion ? `${t("ban")}: ${name}` : active ? t("onTheClock") : t("ban");
        return (
          <div
            key={slot}
            aria-label={`${isBlue ? t("blueShort") : t("redShort")} ${t("ban")} ${slot + 1} — ${state}`}
            className={`bg-surface relative h-10 w-10 overflow-hidden rounded border transition-all duration-200 ${
              active ? `animate-glow ${activeRing}` : "border-line"
            }`}
          >
            {champion ? (
              <>
                <Image
                  src={championIconUrl(version, champion.id)}
                  alt={name}
                  width={44}
                  height={44}
                  unoptimized
                  className="animate-pop h-full w-full object-cover opacity-75 grayscale"
                />
                <span
                  className="absolute inset-0 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="bg-red-side/90 h-0.5 w-[135%] rotate-45" />
                </span>
              </>
            ) : (
              <span
                className="text-ink-faint flex h-full items-center justify-center"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="m5.6 5.6 12.8 12.8" strokeLinecap="round" />
                </svg>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
