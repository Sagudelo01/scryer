export type Team = "blue" | "red";

export type ActionType = "ban" | "pick";

export interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  tags: string[];
}

export interface ChampionData {
  version: string;
  champions: Champion[];
}

export interface DraftStep {
  team: Team;
  type: ActionType;
  /** Zero-based index within the team's list of bans or picks. */
  slot: number;
}

export interface GameResult {
  bluePicks: string[];
  redPicks: string[];
}
