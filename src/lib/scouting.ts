import { z } from "zod";

export interface MasteryLite {
  championId: number;
  championLevel: number;
  championPoints: number;
}

export interface ParticipantLite {
  puuid: string;
  championId: number;
  win: boolean;
}

export interface MatchLite {
  participants: ParticipantLite[];
}

export interface ChampionStat {
  games: number;
  wins: number;
}

/** Count games and wins per champion for a given player across recent matches. */
export function aggregateChampionStats(
  matches: MatchLite[],
  puuid: string,
): Map<number, ChampionStat> {
  const stats = new Map<number, ChampionStat>();
  for (const match of matches) {
    const me = match.participants.find((p) => p.puuid === puuid);
    if (!me) continue;
    const current = stats.get(me.championId) ?? { games: 0, wins: 0 };
    current.games += 1;
    if (me.win) current.wins += 1;
    stats.set(me.championId, current);
  }
  return stats;
}

export const scoutedChampionSchema = z.object({
  championId: z.number(),
  championKey: z.string(),
  masteryLevel: z.number(),
  masteryPoints: z.number(),
  games: z.number(),
  wins: z.number(),
  winrate: z.number().nullable(),
});

export const scoutReportSchema = z.object({
  riotId: z.string(),
  region: z.string(),
  champions: z.array(scoutedChampionSchema),
});

export type ScoutedChampion = z.infer<typeof scoutedChampionSchema>;
export type ScoutReport = z.infer<typeof scoutReportSchema>;

/**
 * Combine mastery with recent-form stats into a ranked scouting report. The
 * list is the player's top mastery champions, each enriched with win rate and
 * games from the recent matches (a transformative read, not a raw data dump).
 */
export function buildScoutReport(
  masteries: MasteryLite[],
  matches: MatchLite[],
  puuid: string,
  topN: number,
): ScoutedChampion[] {
  const stats = aggregateChampionStats(matches, puuid);
  return [...masteries]
    .sort((a, b) => b.championPoints - a.championPoints)
    .slice(0, topN)
    .map((mastery) => {
      const stat = stats.get(mastery.championId) ?? { games: 0, wins: 0 };
      return {
        championId: mastery.championId,
        championKey: String(mastery.championId),
        masteryLevel: mastery.championLevel,
        masteryPoints: mastery.championPoints,
        games: stat.games,
        wins: stat.wins,
        winrate: stat.games > 0 ? stat.wins / stat.games : null,
      };
    });
}
