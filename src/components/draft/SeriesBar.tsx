"use client";

import Image from "next/image";
import { championIconUrl } from "@/lib/ddragon";
import type { Champion, GameResult } from "@/lib/types";

interface SeriesBarProps {
  version: string;
  history: GameResult[];
  championsById: Map<string, Champion>;
  lockedCount: number;
}

export function SeriesBar({ version, history, championsById, lockedCount }: SeriesBarProps) {
  if (history.length === 0) {
    return (
      <div className="hex-panel hex-clip text-ink-dim rounded-md px-4 py-3 text-sm">
        <span className="text-gold">Game 1.</span> No champions are locked yet. Picks from each
        completed game become unavailable for the rest of the series.
      </div>
    );
  }

  return (
    <div className="hex-panel hex-clip rounded-md px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-gold text-sm font-semibold tracking-wide">
          Series history
        </h3>
        <span className="text-ink-dim text-xs">{lockedCount} champions locked</span>
      </div>
      <div className="thin-scroll flex gap-4 overflow-x-auto pb-1">
        {history.map((game, index) => (
          <div key={index} className="shrink-0">
            <p className="text-ink-faint mb-1.5 text-[11px] font-medium tracking-wide uppercase">
              Game {index + 1}
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
  const ring = tone === "blue" ? "ring-blue-side/50" : "ring-red-side/50";
  return (
    <div className="flex gap-1">
      {ids.map((id) => {
        const champion = championsById.get(id);
        if (!champion) return null;
        return (
          <div
            key={id}
            className={`h-7 w-7 overflow-hidden rounded ring-1 ${ring}`}
            title={champion.name}
          >
            <Image
              src={championIconUrl(version, id)}
              alt={champion.name}
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
