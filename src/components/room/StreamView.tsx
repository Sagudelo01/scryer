"use client";

import { useEffect, useMemo } from "react";
import * as engine from "@/lib/draft-engine";
import type { ChampionData, Team } from "@/lib/types";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useRoom } from "@/hooks/useRoom";
import { TeamColumn } from "@/components/draft/TeamColumn";

export function StreamView({ code, data, bg }: { code: string; data: ChampionData; bg: string }) {
  const { version, champions } = data;
  const { t } = useLanguage();
  const room = useRoom(code, { autoJoin: false });

  const background = bg === "dark" ? "" : bg === "transparent" ? "transparent" : bg;

  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    const prev = { color: body.style.backgroundColor, image: body.style.backgroundImage };
    body.style.backgroundColor = background || "";
    body.style.backgroundImage = background ? "none" : "";
    if (background) root.setAttribute("data-bg-plain", "");
    return () => {
      body.style.backgroundColor = prev.color;
      body.style.backgroundImage = prev.image;
      root.removeAttribute("data-bg-plain");
    };
  }, [background]);

  const championsById = useMemo(() => new Map(champions.map((c) => [c.id, c])), [champions]);
  const state = room.room?.state ?? engine.createInitialState();
  const current = engine.currentStep(state);
  const isComplete = engine.isComplete(state);
  const lockedCount = useMemo(() => engine.fearlessLocked(state).size, [state]);

  const getAssignment = (team: Team, type: "ban" | "pick", slot: number) =>
    engine.getAssignment(state, team, type, slot);
  const isActiveSlot = (team: Team, type: "ban" | "pick", slot: number) =>
    engine.isActiveSlot(state, team, type, slot);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4">
      <div className="hex-panel hex-clip flex items-center justify-between gap-4 rounded-md px-4 py-2">
        <span className="font-display text-gold text-sm font-semibold tracking-wide">
          {t("game")} {engine.gameNumber(state)} · {t("fearless")}
        </span>
        <span className="font-display text-sm font-semibold tracking-wide">
          {isComplete ? (
            <span className="text-gold-bright">{t("draftComplete")}</span>
          ) : (
            <span className="flex items-center gap-2">
              <span
                className={`animate-glow h-2.5 w-2.5 rounded-full ${
                  current?.team === "blue" ? "bg-blue-side" : "bg-red-side"
                }`}
              />
              <span className={current?.team === "blue" ? "text-blue-side" : "text-red-side"}>
                {current?.team === "blue" ? t("blueShort") : t("redShort")}{" "}
                {current?.type === "ban" ? t("ban") : t("pick")}
              </span>
            </span>
          )}
        </span>
        <span className="text-ink-faint text-xs">
          {lockedCount} {t("championsLocked")}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TeamColumn
          team="blue"
          version={version}
          championsById={championsById}
          getAssignment={getAssignment}
          isActiveSlot={isActiveSlot}
          align="left"
        />
        <TeamColumn
          team="red"
          version={version}
          championsById={championsById}
          getAssignment={getAssignment}
          isActiveSlot={isActiveSlot}
          align="right"
        />
      </div>
    </div>
  );
}
