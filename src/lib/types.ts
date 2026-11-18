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

export interface DraftState {
  /** Champion id assigned to each step of the current game, or null if empty. */
  assignments: (string | null)[];
  /** Index of the next step to fill (equals sequence length when complete). */
  cursor: number;
  /** Picks from previous games of the series, locked by the Fearless rule. */
  history: GameResult[];
}
