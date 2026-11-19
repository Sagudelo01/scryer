"use client";

import Image from "next/image";
import { championIconUrl } from "@/lib/ddragon";
import { championName } from "@/lib/i18n";
import type { Champion, GameResult } from "@/lib/types";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface SeriesBarProps {
  version: string;
  history: GameResult[];
  championsById: Map<string, Champion>;
  lockedCount: number;
}

export function SeriesBar({ version, history, championsById, lockedCount }: SeriesBarProps) {
  const { t } = useLanguage();

  if (history.length === 0) {
    return (
      <div className="hex-panel hex-clip text-ink-dim rounded-md px-4 py-3 text-sm">
        <span className="text-gold">{t("game")} 1.</span> {t("seriesEmpty")}
      </div>
    );
  }

  return (
    <div className="hex-panel hex-clip rounded-md px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-gold text-sm font-semibold tracking-wide">
          {t("seriesHistory")}
        </h3>
        <span className="text-ink-dim text-xs">
          {lockedCount} {t("championsLocked")}
        </span>
      </div>
      <div className="thin-scroll flex gap-4 overflow-x-auto pb-1">
        {history.map((game, index) => (
          <div key={index} className="shrink-0">
            <p className="text-ink-faint mb-1.5 text-[11px] font-medium tracking-wide uppercase">
              {t("game")} {index + 1}
            </p>
            <div className="flex gap-3">
              <TeamStrip
                version={version}
                ids={game.bluePicks}
                championsById={championsById}
                tone="blue"
              />
              <TeamStrip
                version={version}
                ids={game.redPicks}
                championsById={championsById}
                tone="red"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamStrip({
  version,
  ids,
  championsById,
  tone,
}: {
  version: string;
  ids: string[];
  championsById: Map<string, Champion>;
  tone: "blue" | "red";
}) {
  const { locale } = useLanguage();
  const ring = tone === "blue" ? "ring-blue-side/50" : "ring-red-side/50";
  return (
    <div className="flex gap-1">
      {ids.map((id) => {
        const champion = championsById.get(id);
        if (!champion) return null;
        const name = championName(champion, locale);
        return (
          <div key={id} className={`h-7 w-7 overflow-hidden rounded ring-1 ${ring}`} title={name}>
            <Image
              src={championIconUrl(version, id)}
              alt={name}
              width={28}
              height={28}
              unoptimized
              className="h-full w-full object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
