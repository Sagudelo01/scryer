import type { Champion, ChampionData } from "./types";
import type { Locale } from "./i18n";
import { DD_LOCALE, LOCALES } from "./i18n";
import { championResponseSchema, versionsSchema } from "./schemas";

const DDRAGON = "https://ddragon.leagueoflegends.com";
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

async function getChampionsForLocale(version: string, locale: Locale) {
  const res = await fetch(`${DDRAGON}/cdn/${version}/data/${DD_LOCALE[locale]}/champion.json`, {
    next: { revalidate: ONE_DAY },
  });
  if (!res.ok) {
    throw new Error(`Failed to load champion list for ${locale} (${res.status})`);
  }
  const payload = championResponseSchema.parse(await res.json());
  return { locale, data: payload.data };
}

export async function getChampionData(): Promise<ChampionData> {
  const version = await getLatestVersion();
  const perLocale = await Promise.all(
    LOCALES.map((locale) => getChampionsForLocale(version, locale)),
  );

  const base = perLocale[0].data;
  const champions: Champion[] = Object.values(base).map((c) => {
    const names = {} as Record<Locale, string>;
    for (const { locale, data } of perLocale) {
      names[locale] = data[c.id]?.name ?? c.name;
    }
    return { id: c.id, key: c.key, tags: c.tags, names };
  });

  return { version, champions };
}

export function championIconUrl(version: string, championId: string): string {
  return `${DDRAGON}/cdn/${version}/img/champion/${championId}.png`;
}
