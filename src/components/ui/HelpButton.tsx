"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n";

const STEPS: Array<{ title: TranslationKey; body: TranslationKey }> = [
  { title: "guideLocalTitle", body: "guideLocalBody" },
  { title: "guideRoomTitle", body: "guideRoomBody" },
  { title: "guideScoutTitle", body: "guideScoutBody" },
  { title: "guideStreamTitle", body: "guideStreamBody" },
];

export function HelpButton() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("help")}
        className="border-line text-ink-dim hover:border-gold/60 hover:text-gold flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold transition-colors"
      >
        ?
      </button>

      {open && (
        <div
          className="bg-abyss/70 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t("guideTitle")}
        >
          <div
            className="hex-panel hex-clip animate-pop w-full max-w-md rounded-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-gold-bright text-lg font-bold tracking-wide">
                {t("guideTitle")}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
                className="text-ink-faint hover:text-ink transition-colors"
              >
                ✕
              </button>
            </div>
            <ol className="flex flex-col gap-4">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="border-gold/50 text-gold font-display flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-display text-ink text-sm font-semibold">{t(step.title)}</p>
                    <p className="text-ink-dim mt-0.5 text-sm leading-relaxed">{t(step.body)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
