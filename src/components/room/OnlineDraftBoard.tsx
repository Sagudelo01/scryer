"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import * as engine from "@/lib/draft-engine";
import { canAct as canActRule } from "@/lib/room";
import type { ChampionData, Team } from "@/lib/types";
import { Logo } from "@/components/brand/Logo";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";
import { useRoom } from "@/hooks/useRoom";
import { useBanTargets } from "@/hooks/useBanTargets";
import { ScoutingPanel } from "@/components/scouting/ScoutingPanel";
import { ChampionGrid } from "@/components/draft/ChampionGrid";
import { TeamColumn } from "@/components/draft/TeamColumn";
import { SeriesBar } from "@/components/draft/SeriesBar";

export function OnlineDraftBoard({ code, data }: { code: string; data: ChampionData }) {
  const { version, champions } = data;
  const { t } = useLanguage();
  const room = useRoom(code);
  const bans = useBanTargets();

  const championsById = useMemo(() => new Map(champions.map((c) => [c.id, c])), [champions]);
  const state = room.room?.state ?? engine.createInitialState();

  const fearlessLocked = useMemo(() => engine.fearlessLocked(state), [state]);
  const current = engine.currentStep(state);
  const isComplete = engine.isComplete(state);
  const isDrafting = room.room?.status === "drafting";
  const canActNow = Boolean(room.room) && isDrafting && canActRule(room.role, state);
  const isCaptain = room.role !== "spectator";

  if (room.error === "config") {
    return (
      <Notice title={t("onlineUnavailable")} action={{ href: "/draft", label: t("localDraft") }} />
    );
  }
  if (room.error === "not-found") {
    return <Notice title={t("roomNotFound")} action={{ href: "/", label: t("backHome") }} />;
  }
  if (room.loading || !room.room) {
    return <Notice title={t("loadingRoom")} />;
  }

  const roleLabelText =
    room.role === "blue" ? t("roleBlue") : room.role === "red" ? t("roleRed") : t("roleSpectator");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <ConnectionBadge connection={room.connection} />
          <span className="border-line text-ink-dim rounded-full border px-3 py-1 text-xs font-medium">
            {roleLabelText}
          </span>
          <LanguageToggle />
          <span className="border-gold/40 bg-gold/10 font-display text-gold rounded-full border px-3 py-1 text-sm font-semibold tracking-wide">
            {t("game")} {engine.gameNumber(state)}
          </span>
          <span className="border-cyan/40 bg-cyan/10 text-cyan rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase">
            {t("fearless")}
          </span>
        </div>
      </header>

      <RoomStrip code={code} room={room} />

      <SeriesBar
        version={version}
        history={state.history}
        championsById={championsById}
        lockedCount={fearlessLocked.size}
      />

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
        className={`flex flex-wrap items-center justify-between gap-4 rounded-md border px-4 py-3 transition-colors ${
          isComplete
            ? "border-gold/50 bg-gold/10"
            : current?.team === "blue"
              ? "border-blue-side/50 bg-blue-side/10"
              : "border-red-side/50 bg-red-side/10"
        }`}
      >
        <div className="flex items-center gap-3">
          {!isComplete && (
            <span
              className={`animate-glow h-3 w-3 rounded-full ${
                current?.team === "blue" ? "bg-blue-side" : "bg-red-side"
              }`}
            />
          )}
          <p className="font-display text-base font-semibold tracking-wide">
            {isComplete ? (
              <span className="text-gold-bright">{t("draftComplete")}</span>
            ) : !isCaptain ? (
              <span className="text-ink-dim">{t("spectatingNotice")}</span>
            ) : canActNow ? (
              <>
                {t("onTheClock")}{" "}
                <span className={current?.team === "blue" ? "text-blue-side" : "text-red-side"}>
                  {current?.team === "blue" ? t("blueShort") : t("redShort")}{" "}
                  {current?.type === "ban" ? t("ban") : t("pick")}
                </span>
              </>
            ) : (
              <span className="text-ink-dim">{t("waitingOtherCaptain")}</span>
            )}
          </p>
        </div>
        {isCaptain && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={room.undo}
              disabled={state.cursor === 0}
              className="border-line text-ink-dim hover:border-ink-faint hover:text-ink rounded border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("undo")}
            </button>
            <button
              type="button"
              onClick={room.resetGame}
              className="border-line text-ink-dim hover:border-ink-faint hover:text-ink rounded border px-3 py-1.5 text-xs font-medium transition-colors"
            >
              {t("resetGame")}
            </button>
            {isComplete && (
              <button
                type="button"
                onClick={room.confirmGame}
                className="animate-pop border-gold bg-gold/20 text-gold-bright hover:bg-gold/30 rounded border px-4 py-1.5 text-xs font-bold tracking-wide transition-colors"
              >
                {t("confirmGame")} →
              </button>
            )}
          </div>
        )}
      </div>

      {room.actionError && (
        <p className="border-red-side/50 bg-red-side/10 text-red-side rounded-md border px-4 py-2 text-xs">
          {t("actionRejected")}: {room.actionError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)_minmax(0,1fr)]">
        <TeamColumn
          team="blue"
          version={version}
          championsById={championsById}
          getAssignment={(team: Team, type, slot) => engine.getAssignment(state, team, type, slot)}
          isActiveSlot={(team: Team, type, slot) => engine.isActiveSlot(state, team, type, slot)}
          align="left"
        />

        <div className="order-first lg:order-none">
          <ChampionGrid
            champions={champions}
            version={version}
            isUnavailable={(id) => engine.isUnavailable(state, id)}
            isFearlessLocked={(id) => fearlessLocked.has(id)}
            disabled={!canActNow}
            onSelect={room.select}
            highlighted={bans.banTargets}
          />
        </div>

        <TeamColumn
          team="red"
          version={version}
          championsById={championsById}
          getAssignment={(team: Team, type, slot) => engine.getAssignment(state, team, type, slot)}
          isActiveSlot={(team: Team, type, slot) => engine.isActiveSlot(state, team, type, slot)}
          align="right"
        />
      </div>

      <footer className="border-line text-ink-faint flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-xs">
        <p>
          {t("patch")} {version} · {t("footerData")}
        </p>
        {isCaptain && (
          <button
            type="button"
            onClick={room.resetSeries}
            className="border-line text-ink-dim hover:border-red-side/60 hover:text-red-side rounded border px-3 py-1.5 font-medium transition-colors"
          >
            {t("resetSeries")}
          </button>
        )}
      </footer>
    </div>
  );
}

function RoomStrip({ code, room }: { code: string; room: ReturnType<typeof useRoom> }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const waiting = room.room?.status === "waiting";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard may be blocked; the code is still visible on screen.
    }
  };

  return (
    <div className="hex-panel hex-clip flex flex-wrap items-center justify-between gap-3 rounded-md px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="text-ink-dim">
          {t("room")} <span className="text-gold-bright font-display font-bold">{code}</span>
        </span>
        <span className="flex items-center gap-1.5 text-xs">
          <Dot on={room.presence.blueOnline} tone="blue" />
          <Dot on={room.presence.redOnline} tone="red" />
          <span className="text-ink-faint">
            {room.presence.redOnline ? t("opponentConnected") : t("opponentOffline")}
          </span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        {waiting && <span className="text-ink-dim text-xs">{t("waitingOpponent")}</span>}
        <button
          type="button"
          onClick={copyLink}
          className="border-cyan/50 bg-cyan/10 text-cyan hover:bg-cyan/20 rounded border px-3 py-1.5 text-xs font-medium transition-colors"
        >
          {copied ? t("linkCopied") : t("copyLink")}
        </button>
      </div>
    </div>
  );
}

function Dot({ on, tone }: { on: boolean; tone: "blue" | "red" }) {
  const color = tone === "blue" ? "bg-blue-side" : "bg-red-side";
  return <span className={`h-2 w-2 rounded-full ${on ? color : "bg-ink-faint/40"}`} />;
}

function ConnectionBadge({
  connection,
}: {
  connection: "connecting" | "connected" | "reconnecting";
}) {
  const { t } = useLanguage();
  const map = {
    connected: {
      label: t("connected"),
      color: "text-cyan border-cyan/40 bg-cyan/10",
      dot: "bg-cyan",
    },
    connecting: {
      label: t("connecting"),
      color: "text-ink-dim border-line bg-surface/60",
      dot: "bg-ink-faint",
    },
    reconnecting: {
      label: t("reconnecting"),
      color: "text-gold border-gold/40 bg-gold/10",
      dot: "bg-gold animate-glow",
    },
  } as const;
  const c = map[connection];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${c.color}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function Notice({ title, action }: { title: string; action?: { href: string; label: string } }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <Logo />
      <p className="text-ink-dim">{title}</p>
      {action && (
        <Link
          href={action.href}
          className="border-gold/50 bg-gold/10 text-gold hover:bg-gold/20 rounded-md border px-4 py-2 text-sm font-semibold transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
