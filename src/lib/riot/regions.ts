export type RiotCluster = "americas" | "asia" | "europe" | "sea";

export interface RiotRegion {
  /** Stable id used in the UI and query string. */
  id: string;
  /** Platform host prefix for platform-routed endpoints (champion mastery). */
  platform: string;
  /** Regional cluster for account and match endpoints. */
  cluster: RiotCluster;
  label: string;
}

export const RIOT_REGIONS: RiotRegion[] = [
  { id: "na1", platform: "na1", cluster: "americas", label: "North America" },
  { id: "br1", platform: "br1", cluster: "americas", label: "Brazil" },
  { id: "la1", platform: "la1", cluster: "americas", label: "LAN" },
  { id: "la2", platform: "la2", cluster: "americas", label: "LAS" },
  { id: "euw1", platform: "euw1", cluster: "europe", label: "EU West" },
  { id: "eun1", platform: "eun1", cluster: "europe", label: "EU Nordic & East" },
  { id: "tr1", platform: "tr1", cluster: "europe", label: "Turkey" },
  { id: "ru", platform: "ru", cluster: "europe", label: "Russia" },
  { id: "kr", platform: "kr", cluster: "asia", label: "Korea" },
  { id: "jp1", platform: "jp1", cluster: "asia", label: "Japan" },
  { id: "oc1", platform: "oc1", cluster: "sea", label: "Oceania" },
];

export function findRegion(id: string): RiotRegion | undefined {
  return RIOT_REGIONS.find((r) => r.id === id);
}
