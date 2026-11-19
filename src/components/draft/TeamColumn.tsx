"use client";

import Image from "next/image";
import { championIconUrl } from "@/lib/ddragon";
import { BANS_PER_TEAM, PICKS_PER_TEAM } from "@/lib/draft-sequence";
import { championName, roleLabel } from "@/lib/i18n";
import type { Champion, Team } from "@/lib/types";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface TeamColumnProps {
  team: Team;
  version: string;
  championsById: Map<string, Champion>;
  getAssignment: (team: Team, type: "ban" | "pick", slot: number) => string | null;
  isActiveSlot: (team: Team, type: "ban" | "pick", slot: number) => boolean;
  align: "left" | "right";
}

export function TeamColumn({
  team,
  version,
  championsById,
  getAssignment,
  isActiveSlot,
  align,
}: TeamColumnProps) {
  const { locale, t } = useLanguage();
  const isBlue = team === "blue";
  const accent = isBlue ? "text-blue-side" : "text-red-side";
  const border = isBlue ? "border-blue-side/50" : "border-red-side/50";
  const activeRing = isBlue
    ? "border-blue-side shadow-[0_0_18px_-2px_rgba(74,140,255,0.8)]"
    : "border-red-side shadow-[0_0_18px_-2px_rgba(255,85,85,0.8)]";

  return (
    <div className="flex flex-col gap-3">
      <div
        className={`flex items-center gap-2 ${align === "right" ? "flex-row-reverse text-right" : ""}`}
      >
        <span className={`h-2.5 w-2.5 rotate-45 ${isBlue ? "bg-blue-side" : "bg-red-side"}`} />
        <h2 className={`font-display text-lg font-bold tracking-wide ${accent}`}>
          {isBlue ? t("blueSide") : t("redSide")}
        </h2>
      </div>

      <div className={`flex gap-1.5 ${align === "right" ? "flex-row-reverse" : ""}`}>
        {Array.from({ length: BANS_PER_TEAM }).map((_, slot) => {
          const id = getAssignment(team, "ban", slot);
          const champion = id ? championsById.get(id) : null;
          const name = champion ? championName(champion, locale) : "";
          const active = isActiveSlot(team, "ban", slot);
          return (
            <div
              key={slot}
              className={`bg-void/60 relative aspect-square w-full overflow-hidden rounded border ${
                active ? `animate-glow ${activeRing}` : "border-line"
              }`}
              title={champion ? `${t("ban")}: ${name}` : t("ban")}
            >
              {champion ? (
                <>
                  <Image
                    src={championIconUrl(version, champion.id)}
                    alt={name}
                    width={48}
                    height={48}
                    unoptimized
                    className="h-full w-full object-cover opacity-80 grayscale"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-red-side/90 h-0.5 w-[130%] rotate-45" />
                  </span>
                </>
              ) : (
                <div className="text-ink-faint flex h-full items-center justify-center">
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
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        {Array.from({ length: PICKS_PER_TEAM }).map((_, slot) => {
          const id = getAssignment(team, "pick", slot);
          const champion = id ? championsById.get(id) : null;
          const name = champion ? championName(champion, locale) : "";
          const active = isActiveSlot(team, "pick", slot);
          return (
            <div
              key={slot}
              className={`relative flex h-16 items-center gap-3 overflow-hidden rounded-md border bg-gradient-to-r transition-all ${
                align === "right" ? "flex-row-reverse" : ""
              } ${
                active
                  ? `animate-glow ${activeRing}`
                  : champion
                    ? `${border} ${isBlue ? "from-blue-side/15" : "from-red-side/15"} to-transparent`
                    : "border-line border-dashed"
              }`}
            >
              {champion ? (
                <>
                  <div className="relative h-full w-16 shrink-0">
                    <Image
                      src={championIconUrl(version, champion.id)}
                      alt={name}
                      fill
                      unoptimized
                      sizes="64px"
                      className="animate-pop object-cover"
                    />
                  </div>
                  <div className={`min-w-0 flex-1 px-1 ${align === "right" ? "text-right" : ""}`}>
                    <p className="font-display text-ink truncate text-sm font-semibold">{name}</p>
                    <p className="text-ink-faint truncate text-[11px]">
                      {champion.tags[0] ? roleLabel(locale, champion.tags[0]) : ""}
                    </p>
                  </div>
                </>
              ) : (
                <div
                  className={`text-ink-faint flex w-full items-center px-3 text-xs ${
                    align === "right" ? "justify-end" : ""
                  }`}
                >
                  {t("pick")} {slot + 1}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
