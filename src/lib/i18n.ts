import type { Champion } from "./types";

export type Locale = "en" | "es";

export const LOCALES: Locale[] = ["en", "es"];
export const DEFAULT_LOCALE: Locale = "en";

/** Maps an app locale to the matching Data Dragon locale code. */
export const DD_LOCALE: Record<Locale, string> = {
  en: "en_US",
  es: "es_MX",
};

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  es: "ES",
};

const en = {
  openDraft: "Open draft room",
  language: "Language",

  game: "Game",
  fearless: "Fearless",
  blueShort: "Blue",
  redShort: "Red",
  blueSide: "Blue Side",
  redSide: "Red Side",
  ban: "Ban",
  pick: "Pick",

  onTheClock: "On the clock:",
  draftComplete: "Draft complete — confirm to lock this game",
  undo: "Undo",
  resetGame: "Reset game",
  confirmGame: "Confirm game",
  resetSeries: "Reset series",
  turnTimer: "Turn timer",

  patch: "Patch",
  footerData: "Champion data from Riot Data Dragon. Scryer is not endorsed by Riot Games.",

  seriesEmpty:
    "No champions are locked yet. Picks from each completed game become unavailable for the rest of the series.",
  seriesHistory: "Series history",
  championsLocked: "champions locked",
  reserveTitle: "Pick reserve by role",

  searchChampion: "Search champion",
  noMatches: "No champions match your search.",
  usedEarlier: "used earlier in the series",

  roleAll: "All",
  role_Fighter: "Fighter",
  role_Tank: "Tank",
  role_Mage: "Mage",
  role_Assassin: "Assassin",
  role_Marksman: "Marksman",
  role_Support: "Support",

  heroKicker: "Fearless Draft · Live Scouting",
  heroTitleA: "See the draft",
  heroTitleB: "before it happens",
  heroBody:
    "Scryer is a Fearless Draft simulator and scouting tool for the amateur competitive League of Legends scene. Run a full best-of series in a pro-style draft room and keep every pick honest across games.",
  howItWorks: "How it works",

  feature1Title: "Fearless Draft engine",
  feature1Body:
    "Draft a full best-of series with the standard tournament ban and pick order. Every champion picked in an earlier game is locked out for the rest of the series.",
  feature2Title: "Live scouting",
  feature2Body:
    "As the draft unfolds, surface which available champions the opposing players have real mastery on. See what is hidden before it is picked.",
  feature3Title: "Built for amateurs",
  feature3Body:
    "Made for the grassroots competitive scene: community tournaments, scrim blocks and aspiring coaches who want a pro-level draft room for free.",

  whatTitle: "What is Fearless Draft?",
  whatBody:
    "In a Fearless series, a champion that has been picked in any earlier game can no longer be picked again. Teams burn through their comfort picks fast, forcing deep champion pools and fresh drafts every game. Scryer tracks the locked pool for you and keeps the whole series in one draft room.",
  bullet1: "Standard tournament ban/pick order",
  bullet2: "Multi-game series tracking",
  bullet3: "Live champion data from Data Dragon",
  legal:
    "Scryer is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.",

  playOnline: "Play live",
  localDraft: "Local draft",
  createRoom: "Create a live room",
  joinRoom: "Join",
  roomCodePlaceholder: "Room code",
  creatingRoom: "Creating room...",
  onlineUnavailable: "Online play is not configured.",
  copyLink: "Copy link",
  linkCopied: "Link copied",
  streamOverlay: "Stream overlay",
  room: "Room",
  waitingOpponent: "Waiting for an opponent to join...",
  shareToInvite: "Share this link to invite the other captain.",
  roleBlue: "Blue captain",
  roleRed: "Red captain",
  roleSpectator: "Spectator",
  connected: "Connected",
  connecting: "Connecting...",
  reconnecting: "Reconnecting...",
  disconnected: "Disconnected",
  opponentConnected: "Opponent connected",
  opponentOffline: "Opponent offline",
  waitingOtherCaptain: "Waiting for the other captain",
  spectatingNotice: "You are watching this draft.",
  roomNotFound: "Room not found.",
  loadingRoom: "Loading room...",
  backHome: "Back to home",
  actionRejected: "Action rejected",

  rivalScouting: "Rival scouting",
  scoutingHint:
    "Enter a rival's Riot ID to see their most-played champions and mark likely picks as ban targets.",
  riotIdPlaceholder: "Riot ID (Name#TAG)",
  regionLabel: "Region",
  scout: "Scout",
  scoutingLoading: "Scouting...",
  mastery: "Mastery",
  masteryPoints: "pts",
  recentGamesLabel: "recent games",
  markForBan: "Mark for ban",
  marked: "Marked",
  markAllBans: "Mark all as ban targets",
  clearMarks: "Clear marks",
  banTargets: "Ban targets",
  noMasteryData: "No recent games found to analyse.",
  scoutError_not_configured: "Scouting is not configured.",
  scoutError_invalid_input: "Enter a Riot ID as Name#TAG and choose a region.",
  scoutError_not_found: "Player not found. Check the Riot ID and region.",
  scoutError_rate_limited: "Rate limit reached. Try again in a moment.",
  scoutError_upstream: "The Riot API is unavailable right now.",
};

type Dictionary = typeof en;
export type TranslationKey = keyof Dictionary;

const es: Dictionary = {
  openDraft: "Abrir sala de draft",
  language: "Idioma",

  game: "Juego",
  fearless: "Fearless",
  blueShort: "Azul",
  redShort: "Rojo",
  blueSide: "Lado Azul",
  redSide: "Lado Rojo",
  ban: "Baneo",
  pick: "Pick",

  onTheClock: "En turno:",
  draftComplete: "Draft completo — confirma para fijar este juego",
  undo: "Deshacer",
  resetGame: "Reiniciar juego",
  confirmGame: "Confirmar juego",
  resetSeries: "Reiniciar serie",
  turnTimer: "Temporizador",

  patch: "Parche",
  footerData: "Datos de campeones de Riot Data Dragon. Scryer no está avalado por Riot Games.",

  seriesEmpty:
    "Aún no hay campeones bloqueados. Los picks de cada juego completado quedan inhabilitados por el resto de la serie.",
  seriesHistory: "Historial de la serie",
  championsLocked: "campeones bloqueados",
  reserveTitle: "Reserva de picks por rol",

  searchChampion: "Buscar campeón",
  noMatches: "Ningún campeón coincide con tu búsqueda.",
  usedEarlier: "usado antes en la serie",

  roleAll: "Todos",
  role_Fighter: "Luchador",
  role_Tank: "Tanque",
  role_Mage: "Mago",
  role_Assassin: "Asesino",
  role_Marksman: "Tirador",
  role_Support: "Soporte",

  heroKicker: "Fearless Draft · Scouting en vivo",
  heroTitleA: "Ve el draft",
  heroTitleB: "antes de que ocurra",
  heroBody:
    "Scryer es un simulador de Fearless Draft y herramienta de scouting para la escena competitiva amateur de League of Legends. Juega una serie al mejor de varios en una sala estilo profesional y mantén cada pick limpio entre juegos.",
  howItWorks: "Cómo funciona",

  feature1Title: "Motor de Fearless Draft",
  feature1Body:
    "Draftea una serie completa con el orden estándar de bans y picks de torneo. Cada campeón elegido en un juego anterior queda bloqueado por el resto de la serie.",
  feature2Title: "Scouting en vivo",
  feature2Body:
    "A medida que avanza el draft, muestra en qué campeones disponibles los rivales tienen verdadera maestría. Ve lo que está oculto antes de que lo elijan.",
  feature3Title: "Hecho para amateurs",
  feature3Body:
    "Pensado para la escena competitiva de base: torneos comunitarios, bloques de scrims y entrenadores en formación que quieren una sala de draft profesional y gratuita.",

  whatTitle: "¿Qué es el Fearless Draft?",
  whatBody:
    "En una serie Fearless, un campeón ya elegido en cualquier juego anterior no se puede volver a elegir. Los equipos agotan rápido sus picks de confianza, lo que obliga a pools de campeones profundos y drafts frescos cada juego. Scryer lleva la cuenta del pool bloqueado por ti y mantiene toda la serie en una sola sala.",
  bullet1: "Orden estándar de bans/picks de torneo",
  bullet2: "Seguimiento de series de varios juegos",
  bullet3: "Datos de campeones en vivo desde Data Dragon",
  legal:
    "Scryer no está avalado por Riot Games y no refleja las opiniones ni los puntos de vista de Riot Games ni de nadie involucrado oficialmente en la producción o gestión de League of Legends.",

  playOnline: "Jugar en vivo",
  localDraft: "Draft local",
  createRoom: "Crear sala en vivo",
  joinRoom: "Unirse",
  roomCodePlaceholder: "Código de sala",
  creatingRoom: "Creando sala...",
  onlineUnavailable: "El juego en línea no está configurado.",
  copyLink: "Copiar enlace",
  linkCopied: "Enlace copiado",
  streamOverlay: "Overlay para stream",
  room: "Sala",
  waitingOpponent: "Esperando a que entre un rival...",
  shareToInvite: "Comparte este enlace para invitar al otro capitán.",
  roleBlue: "Capitán Azul",
  roleRed: "Capitán Rojo",
  roleSpectator: "Espectador",
  connected: "Conectado",
  connecting: "Conectando...",
  reconnecting: "Reconectando...",
  disconnected: "Desconectado",
  opponentConnected: "Rival conectado",
  opponentOffline: "Rival desconectado",
  waitingOtherCaptain: "Esperando al otro capitán",
  spectatingNotice: "Estás viendo este draft.",
  roomNotFound: "Sala no encontrada.",
  loadingRoom: "Cargando sala...",
  backHome: "Volver al inicio",
  actionRejected: "Acción rechazada",

  rivalScouting: "Scouting de rivales",
  scoutingHint:
    "Ingresa el Riot ID de un rival para ver sus campeones más jugados y marcar los probables como objetivos de ban.",
  riotIdPlaceholder: "Riot ID (Nombre#TAG)",
  regionLabel: "Región",
  scout: "Analizar",
  scoutingLoading: "Analizando...",
  mastery: "Maestría",
  masteryPoints: "pts",
  recentGamesLabel: "partidas recientes",
  markForBan: "Marcar para ban",
  marked: "Marcado",
  markAllBans: "Marcar todos como objetivos de ban",
  clearMarks: "Limpiar marcas",
  banTargets: "Objetivos de ban",
  noMasteryData: "No se encontraron partidas recientes para analizar.",
  scoutError_not_configured: "El scouting no está configurado.",
  scoutError_invalid_input: "Ingresa un Riot ID como Nombre#TAG y elige una región.",
  scoutError_not_found: "Jugador no encontrado. Revisa el Riot ID y la región.",
  scoutError_rate_limited: "Límite alcanzado. Intenta de nuevo en un momento.",
  scoutError_upstream: "La API de Riot no está disponible ahora.",
};

export const dictionaries: Record<Locale, Dictionary> = { en, es };

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "es";
}

export function translate(locale: Locale, key: TranslationKey): string {
  return dictionaries[locale][key] ?? dictionaries[DEFAULT_LOCALE][key];
}

export function roleLabel(locale: Locale, role: string): string {
  const key = `role_${role}` as TranslationKey;
  return dictionaries[locale][key] ?? role;
}

export function championName(champion: Champion, locale: Locale): string {
  return champion.names[locale] ?? champion.names[DEFAULT_LOCALE];
}

/** Resolve the starting locale from a stored value, then the browser language. */
export function resolveInitialLocale(
  stored: string | null | undefined,
  navigatorLanguage: string | null | undefined,
): Locale {
  if (isLocale(stored)) return stored;
  if (navigatorLanguage && navigatorLanguage.toLowerCase().startsWith("es")) return "es";
  return DEFAULT_LOCALE;
}
