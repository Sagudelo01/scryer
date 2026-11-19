import { CHAMPION_ROLES } from "./draft-sequence";
import type { Champion } from "./types";

export type ReserveLevel = "ok" | "low" | "none";

export interface RoleReserve {
  role: string;
  total: number;
  available: number;
  level: ReserveLevel;
}

export function reserveLevel(available: number, lowThreshold = 3): ReserveLevel {
  if (available <= 0) return "none";
  if (available <= lowThreshold) return "low";
  return "ok";
}

/**
 * How many champions remain pickable for each role once the given champions are
 * unavailable (Fearless locks from earlier games plus picks and bans this game).
 * A champion counts toward every role tag it carries.
 */
export function computeRoleReserve(
  champions: Champion[],
  unavailable: Set<string>,
  lowThreshold = 3,
): RoleReserve[] {
  return CHAMPION_ROLES.map((role) => {
    let total = 0;
    let available = 0;
    for (const champion of champions) {
      if (!champion.tags.includes(role)) continue;
      total += 1;
      if (!unavailable.has(champion.id)) available += 1;
    }
    return { role, total, available, level: reserveLevel(available, lowThreshold) };
  });
}
