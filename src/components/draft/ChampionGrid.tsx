"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { championIconUrl } from "@/lib/ddragon";
import { CHAMPION_ROLES } from "@/lib/draft-sequence";
import type { Champion } from "@/lib/types";

interface ChampionGridProps {
  champions: Champion[];
  version: string;
  isUnavailable: (championId: string) => boolean;
  isFearlessLocked: (championId: string) => boolean;
  disabled: boolean;
  onSelect: (championId: string) => void;
}

export function ChampionGrid({
  champions,
  version,
  isUnavailable,
  isFearlessLocked,
  disabled,
  onSelect,
}: ChampionGridProps) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return champions.filter((c) => {
      const matchesQuery = q === "" || c.name.toLowerCase().includes(q);
      const matchesRole = role === null || c.tags.includes(role);
      return matchesQuery && matchesRole;
    });
  }, [champions, query, role]);

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
            placeholder="Search champion"
            aria-label="Search champion"
            className="border-line bg-void/70 text-ink placeholder:text-ink-faint focus:border-cyan/60 w-full rounded-md border py-2.5 pr-3 pl-9 text-sm transition-colors outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <RoleChip active={role === null} onClick={() => setRole(null)} label="All" />
          {CHAMPION_ROLES.map((r) => (
            <RoleChip key={r} active={role === r} onClick={() => setRole(r)} label={r} />
          ))}
        </div>
      </div>

      <div className="thin-scroll -mr-1 grid max-h-[min(58vh,560px)] grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9">
        {filtered.map((champion) => {
          const unavailable = isUnavailable(champion.id);
          const fearless = isFearlessLocked(champion.id);
          return (
            <button
              key={champion.id}
              type="button"
              disabled={unavailable || disabled}
              onClick={() => onSelect(champion.id)}
              title={fearless ? `${champion.name} — used earlier in the series` : champion.name}
              className={`group relative aspect-square overflow-hidden rounded-md border transition-all duration-150 ${
                unavailable
                  ? "border-line/60 cursor-not-allowed"
                  : "border-line hover:border-gold cursor-pointer hover:z-10 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_-6px_rgba(200,170,110,0.6)]"
              } ${disabled && !unavailable ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <Image
                src={championIconUrl(version, champion.id)}
                alt={champion.name}
                width={64}
                height={64}
                unoptimized
                className={`h-full w-full object-cover transition-all duration-200 ${
                  unavailable ? "grayscale" : "group-hover:scale-110"
                }`}
              />
              {unavailable && <div className="bg-abyss/70 absolute inset-0" />}
              {fearless && (
                <span className="text-gold absolute top-1 right-1" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                    <path d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5Zm3 8H9V6a3 3 0 0 1 6 0v3Z" />
                  </svg>
                </span>
              )}
              <span className="from-abyss/95 text-ink-dim absolute inset-x-0 bottom-0 truncate bg-gradient-to-t to-transparent px-1 pt-3 pb-0.5 text-center text-[10px] leading-tight">
                {champion.name}
              </span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-ink-faint col-span-full py-10 text-center text-sm">
            No champions match your search.
          </p>
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
