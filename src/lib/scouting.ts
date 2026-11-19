import { z } from "zod";

export interface MasteryLite {
  championId: number;
  championLevel: number;
  championPoints: number;
}

export interface ParticipantLite {
  puuid: string;
  championId: number;
}

export interface MatchLite {
  participants: ParticipantLite[];
}

/** Count how many recent games the scouted player has on each champion. */
export function aggregateChampionGames(matches: MatchLite[], puuid: string): Map<number, number> {
  const games = new Map<number, number>();
  for (const match of matches) {
    const entry = match.participants.find((p) => p.puuid === puuid);
    if (!entry) continue;
    games.set(entry.championId, (games.get(entry.championId) ?? 0) + 1);
  }
  return games;
}

export const scoutedChampionSchema = z.object({
  championId: z.number(),
  championKey: z.string(),
  masteryLevel: z.number(),
  masteryPoints: z.number(),
  recentGames: z.number(),
});

export const scoutReportSchema = z.object({
  riotId: z.string(),
  region: z.string(),
  champions: z.array(scoutedChampionSchema),
});

export type ScoutedChampion = z.infer<typeof scoutedChampionSchema>;
export type ScoutReport = z.infer<typeof scoutReportSchema>;

/**
 * Rank a player's champion pool by mastery and annotate how often each champion
 * shows up in their recent games. The report is about champions and priority,
 * not about the player's wins or losses.
 */
export function buildScoutReport(
  masteries: MasteryLite[],
  matches: MatchLite[],
  puuid: string,
  topN: number,
): ScoutedChampion[] {
  const games = aggregateChampionGames(matches, puuid);
  return [...masteries]
    .sort((a, b) => b.championPoints - a.championPoints)
    .slice(0, topN)
    .map((mastery) => ({
      championId: mastery.championId,
      championKey: String(mastery.championId),
      masteryLevel: mastery.championLevel,
      masteryPoints: mastery.championPoints,
      recentGames: games.get(mastery.championId) ?? 0,
    }));
}
