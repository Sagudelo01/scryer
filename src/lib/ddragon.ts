import type { Champion, ChampionData } from "./types";
import { championResponseSchema, versionsSchema } from "./schemas";

const DDRAGON = "https://ddragon.leagueoflegends.com";
const LOCALE = "en_US";
const ONE_DAY = 60 * 60 * 24;

async function getLatestVersion(): Promise<string> {
  const res = await fetch(`${DDRAGON}/api/versions.json`, {
    next: { revalidate: ONE_DAY },
  });
  if (!res.ok) {
    throw new Error(`Failed to load Data Dragon versions (${res.status})`);
  }
  const versions = versionsSchema.parse(await res.json());
  return versions[0];
}

export async function getChampionData(): Promise<ChampionData> {
  const version = await getLatestVersion();
  const res = await fetch(`${DDRAGON}/cdn/${version}/data/${LOCALE}/champion.json`, {
    next: { revalidate: ONE_DAY },
  });
  if (!res.ok) {
    throw new Error(`Failed to load champion list (${res.status})`);
  }
  const payload = championResponseSchema.parse(await res.json());
  const champions: Champion[] = Object.values(payload.data)
    .map((c) => ({
      id: c.id,
      key: c.key,
      name: c.name,
      title: c.title,
      tags: c.tags,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { version, champions };
}

export function championIconUrl(version: string, championId: string): string {
  return `${DDRAGON}/cdn/${version}/img/champion/${championId}.png`;
}
