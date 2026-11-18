import type { DraftStep } from "./types";

/**
 * Standard competitive League of Legends tournament draft order:
 * six bans, six picks, four bans, four picks. Blue bans and picks first.
 */
export const DRAFT_SEQUENCE: DraftStep[] = [
  // Ban phase 1
  { team: "blue", type: "ban", slot: 0 },
  { team: "red", type: "ban", slot: 0 },
  { team: "blue", type: "ban", slot: 1 },
  { team: "red", type: "ban", slot: 1 },
  { team: "blue", type: "ban", slot: 2 },
  { team: "red", type: "ban", slot: 2 },
  // Pick phase 1
  { team: "blue", type: "pick", slot: 0 },
  { team: "red", type: "pick", slot: 0 },
  { team: "red", type: "pick", slot: 1 },
  { team: "blue", type: "pick", slot: 1 },
  { team: "blue", type: "pick", slot: 2 },
  { team: "red", type: "pick", slot: 2 },
  // Ban phase 2
  { team: "red", type: "ban", slot: 3 },
  { team: "blue", type: "ban", slot: 3 },
  { team: "red", type: "ban", slot: 4 },
  { team: "blue", type: "ban", slot: 4 },
  // Pick phase 2
  { team: "red", type: "pick", slot: 3 },
  { team: "blue", type: "pick", slot: 3 },
  { team: "blue", type: "pick", slot: 4 },
  { team: "red", type: "pick", slot: 4 },
];

export const BANS_PER_TEAM = 5;
export const PICKS_PER_TEAM = 5;

export const CHAMPION_ROLES = [
  "Fighter",
  "Tank",
  "Mage",
  "Assassin",
  "Marksman",
  "Support",
] as const;
