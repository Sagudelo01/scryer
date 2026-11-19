import { describe, expect, it } from "vitest";
import {
  DD_LOCALE,
  LOCALES,
  championName,
  dictionaries,
  isLocale,
  resolveInitialLocale,
  roleLabel,
  translate,
} from "./i18n";
import type { Champion } from "./types";

describe("locales", () => {
  it("supports English and Spanish", () => {
    expect(LOCALES).toEqual(["en", "es"]);
  });

  it("maps each locale to a Data Dragon locale code", () => {
    expect(DD_LOCALE.en).toBe("en_US");
    expect(DD_LOCALE.es).toBe("es_MX");
  });

  it("recognises valid locale strings", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("es")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(null)).toBe(false);
  });
});

describe("dictionaries", () => {
  it("define the same keys in every locale", () => {
    const enKeys = Object.keys(dictionaries.en).sort();
    const esKeys = Object.keys(dictionaries.es).sort();
    expect(esKeys).toEqual(enKeys);
  });

  it("have no empty strings", () => {
    for (const locale of LOCALES) {
      for (const value of Object.values(dictionaries[locale])) {
        expect(value.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe("translate", () => {
  it("returns the string for the requested locale", () => {
    expect(translate("en", "undo")).toBe("Undo");
    expect(translate("es", "undo")).toBe("Deshacer");
    expect(translate("en", "confirmGame")).toBe("Confirm game");
    expect(translate("es", "confirmGame")).toBe("Confirmar juego");
  });
});

describe("roleLabel", () => {
  it("localises known champion roles", () => {
    expect(roleLabel("en", "Marksman")).toBe("Marksman");
    expect(roleLabel("es", "Marksman")).toBe("Tirador");
    expect(roleLabel("es", "Support")).toBe("Soporte");
  });

  it("falls back to the raw tag for unknown roles", () => {
    expect(roleLabel("es", "Specialist")).toBe("Specialist");
  });
});

describe("championName", () => {
  const champion: Champion = {
    id: "MonkeyKing",
    key: "62",
    tags: ["Fighter", "Tank"],
    names: { en: "Wukong", es: "Wukong" },
  };

  it("returns the name for the active locale", () => {
    expect(championName(champion, "en")).toBe("Wukong");
  });

  it("falls back to the default locale when a name is missing", () => {
    const partial = { ...champion, names: { en: "Wukong" } } as unknown as Champion;
    expect(championName(partial, "es")).toBe("Wukong");
  });
});

describe("resolveInitialLocale", () => {
  it("prefers a valid stored locale", () => {
    expect(resolveInitialLocale("es", "en-US")).toBe("es");
    expect(resolveInitialLocale("en", "es-MX")).toBe("en");
  });

  it("falls back to the browser language when nothing is stored", () => {
    expect(resolveInitialLocale(null, "es-MX")).toBe("es");
    expect(resolveInitialLocale(null, "es")).toBe("es");
    expect(resolveInitialLocale(null, "en-GB")).toBe("en");
  });

  it("ignores an invalid stored value", () => {
    expect(resolveInitialLocale("fr", "es-ES")).toBe("es");
  });

  it("defaults to English with no hints", () => {
    expect(resolveInitialLocale(null, null)).toBe("en");
    expect(resolveInitialLocale(undefined, undefined)).toBe("en");
  });
});
