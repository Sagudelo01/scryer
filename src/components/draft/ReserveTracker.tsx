"use client";

import { useMemo } from "react";
import { computeRoleReserve } from "@/lib/reserve";
import { roleLabel } from "@/lib/i18n";
import type { Champion } from "@/lib/types";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface ReserveTrackerProps {
  champions: Champion[];
  unavailable: Set<string>;
}

const LEVEL_STYLES = {
  ok: "border-line text-ink-dim",
  low: "border-gold/60 bg-gold/10 text-gold",
  none: "border-red-side/60 bg-red-side/10 text-red-side",
} as const;

export function ReserveTracker({ champions, unavailable }: ReserveTrackerProps) {
  const { locale, t } = useLanguage();
  const reserve = useMemo(
    () => computeRoleReserve(champions, unavailable),
    [champions, unavailable],
  );

  return (
    <div className="hex-panel hex-clip flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md px-4 py-3">
      <span className="font-display text-gold text-sm font-semibold tracking-wide">
        {t("reserveTitle")}
      </span>
      <div className="flex flex-wrap gap-2">
        {reserve.map((role) => (
          <span
            key={role.role}
            title={`${roleLabel(locale, role.role)}: ${role.available}/${role.total}`}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${LEVEL_STYLES[role.level]}`}
          >
            {roleLabel(locale, role.role)}
            <span className="font-display tabular-nums">
              {role.available}
              <span className="text-ink-faint">/{role.total}</span>
            </span>
            {role.level === "none" && <span aria-hidden="true">!</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
