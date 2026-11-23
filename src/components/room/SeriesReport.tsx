"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { championIconUrl } from "@/lib/ddragon";
import { championName } from "@/lib/i18n";
import type { Champion, ChampionData, GameResult } from "@/lib/types";
import { Logo } from "@/components/brand/Logo";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useRoom } from "@/hooks/useRoom";

export function SeriesReport({ code, data }: { code: string; data: ChampionData }) {
  const { version, champions } = data;
  const { locale, t } = useLanguage();
  const room = useRoom(code, { autoJoin: false });
  const [copied, setCopied] = useState(false);

  const championsById = useMemo(() => new Map(champions.map((c) => [c.id, c])), [champions]);
  const history = useMemo(() => room.room?.state.history ?? [], [room.room]);

  const lockedPool = useMemo(() => {
    const ids = new Set<string>();
    for (const game of history) {
      game.bluePicks.forEach((id) => ids.add(id));
      game.redPicks.forEach((id) => ids.add(id));
    }
    return [...ids];
  }, [history]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard may be blocked; the URL is still in the address bar.
    }
  };

  if (room.error === "config") {
    return <Notice title={t("onlineUnavailable")} href="/draft" label={t("localDraft")} />;
  }
  if (room.error === "not-found") {
    return <Notice title={t("roomNotFound")} href="/" label={t("backHome")} />;
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <span className="border-line text-ink-dim rounded-full border px-3 py-1 text-xs">
            {t("seriesReport")} · {code}
          </span>
          <button
            type="button"
            onClick={copyLink}
            className="border-cyan/50 bg-cyan/10 text-cyan hover:bg-cyan/20 rounded border px-3 py-1.5 text-xs font-medium transition-colors"
          >
            {copied ? t("linkCopied") : t("copyLink")}
          </button>
        </div>
      </header>

      {history.length === 0 ? (
        <p className="hex-panel hex-clip text-ink-dim rounded-md px-4 py-6 text-center text-sm">
          {t("noGamesYet")}
        </p>
      ) : (
        history.map((game, index) => (
          <GameCard
            key={index}
            index={index}
            game={game}
            version={version}
            championsById={championsById}
            locale={locale}
            t={t}
          />
        ))
      )}

      {lockedPool.length > 0 && (
        <div className="hex-panel hex-clip rounded-md px-4 py-3">
          <h3 className="font-display text-gold mb-2 text-sm font-semibold tracking-wide">
            {t("lockedPool")} ({lockedPool.length})
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {lockedPool.map((id) => {
              const champion = championsById.get(id);
              if (!champion) return null;
              return (
                <ChampIcon
                  key={id}
                  champion={champion}
                  version={version}
                  locale={locale}
                  size={28}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function GameCard({
  index,
  game,
  version,
  championsById,
  locale,
  t,
}: {
  index: number;
  game: GameResult;
  version: string;
  championsById: Map<string, Champion>;
  locale: "en" | "es";
  t: (key: "game" | "bansLabel" | "picksLabel" | "blueSide" | "redSide") => string;
}) {
  return (
    <div className="hex-panel hex-clip rounded-md px-4 py-4">
      <h3 className="font-display text-gold-bright mb-3 text-sm font-semibold tracking-wide">
        {t("game")} {index + 1}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <TeamReport
          label={t("blueSide")}
          tone="blue"
          bans={game.blueBans}
          picks={game.bluePicks}
          version={version}
          championsById={championsById}
          locale={locale}
          t={t}
        />
        <TeamReport
          label={t("redSide")}
          tone="red"
          bans={game.redBans}
          picks={game.redPicks}
          version={version}
          championsById={championsById}
          locale={locale}
          t={t}
        />
      </div>
    </div>
  );
}

function TeamReport({
  label,
  tone,
  bans,
  picks,
  version,
  championsById,
  locale,
  t,
}: {
  label: string;
  tone: "blue" | "red";
  bans: string[];
  picks: string[];
  version: string;
  championsById: Map<string, Champion>;
  locale: "en" | "es";
  t: (key: "bansLabel" | "picksLabel") => string;
}) {
  const accent = tone === "blue" ? "text-blue-side" : "text-red-side";
  return (
    <div>
      <p className={`font-display mb-2 text-sm font-bold ${accent}`}>{label}</p>
      <p className="text-ink-faint mb-1 text-[11px] tracking-wide uppercase">{t("bansLabel")}</p>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {bans.map((id, i) => {
          const champion = championsById.get(id);
          return champion ? (
            <ChampIcon
              key={i}
              champion={champion}
              version={version}
              locale={locale}
              size={26}
              banned
            />
          ) : null;
        })}
      </div>
      <p className="text-ink-faint mb-1 text-[11px] tracking-wide uppercase">{t("picksLabel")}</p>
      <div className="flex flex-wrap gap-2">
        {picks.map((id, i) => {
          const champion = championsById.get(id);
          return champion ? (
            <div key={i} className="flex items-center gap-1.5">
              <ChampIcon champion={champion} version={version} locale={locale} size={30} />
              <span className="text-ink-dim text-xs">{championName(champion, locale)}</span>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}

function ChampIcon({
  champion,
  version,
  locale,
  size,
  banned = false,
}: {
  champion: Champion;
  version: string;
  locale: "en" | "es";
  size: number;
  banned?: boolean;
}) {
  const name = championName(champion, locale);
  return (
    <span
      className="border-line relative inline-block overflow-hidden rounded border"
      style={{ width: size, height: size }}
      title={name}
    >
      <Image
        src={championIconUrl(version, champion.id)}
        alt={name}
        width={size}
        height={size}
        unoptimized
        className={`h-full w-full object-cover ${banned ? "opacity-70 grayscale" : ""}`}
      />
    </span>
  );
}

function Notice({ title, href, label }: { title: string; href: string; label: string }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <Logo />
      <p className="text-ink-dim">{title}</p>
      <Link
        href={href}
        className="border-gold/60 bg-surface text-gold hover:border-gold hover:bg-surface-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors"
      >
        {label}
      </Link>
    </div>
  );
}
