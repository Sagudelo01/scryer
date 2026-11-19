"use client";

import { LOCALES, LOCALE_LABEL } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      className="border-line inline-flex items-center rounded-full border p-0.5"
      role="group"
      aria-label={t("language")}
    >
      {LOCALES.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors ${
              active ? "bg-gold/20 text-gold-bright" : "text-ink-dim hover:text-ink"
            }`}
          >
            {LOCALE_LABEL[code]}
          </button>
        );
      })}
    </div>
  );
}
