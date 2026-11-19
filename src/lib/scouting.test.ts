import { describe, expect, it } from "vitest";
import {
  aggregateChampionGames,
  buildScoutReport,
  type MasteryLite,
  type MatchLite,
} from "./scouting";

const PUUID = "player-1";

function match(entries: Array<[puuid: string, championId: number]>): MatchLite {
  return { participants: entries.map(([puuid, championId]) => ({ puuid, championId })) };
}

const matches: MatchLite[] = [
  match([
    [PUUID, 1],
    ["enemy", 99],
  ]),
  match([
    [PUUID, 1],
    ["enemy", 98],
  ]),
  match([
    [PUUID, 2],
    ["enemy", 97],
  ]),
  // A match the scouted player did not take part in is ignored.
  match([
    ["other", 5],
    ["enemy", 96],
  ]),
];

describe("aggregateChampionGames", () => {
  it("counts recent games per champion for the player only", () => {
    const games = aggregateChampionGames(matches, PUUID);
    expect(games.get(1)).toBe(2);
    expect(games.get(2)).toBe(1);
    expect(games.has(5)).toBe(false);
  });

  it("returns an empty map when the player is absent", () => {
    expect(aggregateChampionGames(matches, "ghost").size).toBe(0);
  });
});

describe("buildScoutReport", () => {
  const masteries: MasteryLite[] = [
    { championId: 2, championLevel: 5, championPoints: 500 },
    { championId: 1, championLevel: 7, championPoints: 1000 },
    { championId: 3, championLevel: 4, championPoints: 200 },
  ];

  it("ranks by mastery points and annotates recent games", () => {
    const report = buildScoutReport(masteries, matches, PUUID, 3);
    expect(report.map((c) => c.championId)).toEqual([1, 2, 3]);

    expect(report[0]).toMatchObject({
      championId: 1,
      championKey: "1",
      masteryLevel: 7,
      masteryPoints: 1000,
      recentGames: 2,
    });
    expect(report[1]).toMatchObject({ championId: 2, recentGames: 1 });
  });

  it("marks champions with no recent games as zero", () => {
    const report = buildScoutReport(masteries, matches, PUUID, 3);
    expect(report.find((c) => c.championId === 3)).toMatchObject({ recentGames: 0 });
  });

  it("limits the report to the requested number of champions", () => {
    const report = buildScoutReport(masteries, matches, PUUID, 2);
    expect(report).toHaveLength(2);
    expect(report.map((c) => c.championId)).toEqual([1, 2]);
  });
});
