import { describe, expect, it } from "vitest";
import {
  aggregateChampionStats,
  buildScoutReport,
  type MasteryLite,
  type MatchLite,
} from "./scouting";

const PUUID = "player-1";

function match(entries: Array<[puuid: string, championId: number, win: boolean]>): MatchLite {
  return {
    participants: entries.map(([puuid, championId, win]) => ({ puuid, championId, win })),
  };
}

const matches: MatchLite[] = [
  match([
    [PUUID, 1, true],
    ["enemy", 99, false],
  ]),
  match([
    [PUUID, 1, false],
    ["enemy", 98, true],
  ]),
  match([
    [PUUID, 2, true],
    ["enemy", 97, false],
  ]),
  // A match the scouted player did not take part in is ignored.
  match([
    ["other", 5, true],
    ["enemy", 96, false],
  ]),
];

describe("aggregateChampionStats", () => {
  it("counts games and wins per champion for the player only", () => {
    const stats = aggregateChampionStats(matches, PUUID);
    expect(stats.get(1)).toEqual({ games: 2, wins: 1 });
    expect(stats.get(2)).toEqual({ games: 1, wins: 1 });
    expect(stats.has(5)).toBe(false);
  });

  it("returns an empty map when the player is absent", () => {
    expect(aggregateChampionStats(matches, "ghost").size).toBe(0);
  });
});

describe("buildScoutReport", () => {
  const masteries: MasteryLite[] = [
    { championId: 2, championLevel: 5, championPoints: 500 },
    { championId: 1, championLevel: 7, championPoints: 1000 },
    { championId: 3, championLevel: 4, championPoints: 200 },
  ];

  it("ranks by mastery points and enriches with recent win rate", () => {
    const report = buildScoutReport(masteries, matches, PUUID, 3);
    expect(report.map((c) => c.championId)).toEqual([1, 2, 3]);

    const [first] = report;
    expect(first).toMatchObject({
      championId: 1,
      championKey: "1",
      masteryLevel: 7,
      games: 2,
      wins: 1,
      winrate: 0.5,
    });
    expect(report[1]).toMatchObject({ championId: 2, winrate: 1 });
  });

  it("marks champions with no recent games as null win rate", () => {
    const report = buildScoutReport(masteries, matches, PUUID, 3);
    const champ3 = report.find((c) => c.championId === 3);
    expect(champ3).toMatchObject({ games: 0, wins: 0, winrate: null });
  });

  it("limits the report to the requested number of champions", () => {
    const report = buildScoutReport(masteries, matches, PUUID, 2);
    expect(report).toHaveLength(2);
    expect(report.map((c) => c.championId)).toEqual([1, 2]);
  });
});
