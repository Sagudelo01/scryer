"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ensureAnonSession, getSupabaseClient, parseRoom } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function OnlineEntry() {
  const { t } = useLanguage();
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const [code, setCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRoom = async () => {
    setError(null);
    setCreating(true);
    try {
      await ensureAnonSession();
      const { data, error: rpcError } = await getSupabaseClient().rpc("create_room");
      if (rpcError || !data) {
        setError(rpcError?.message ?? "Could not create room");
        return;
      }
      const room = parseRoom(Array.isArray(data) ? data[0] : data);
      router.push(`/room/${room.code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create room");
    } finally {
      setCreating(false);
    }
  };

  const join = () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed) router.push(`/room/${trimmed}`);
  };

  if (!configured) {
    return <p className="text-ink-faint text-sm">{t("onlineUnavailable")}</p>;
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <button
        type="button"
        onClick={createRoom}
        disabled={creating}
        className="group border-gold bg-gold/20 font-display text-gold-bright hover:bg-gold/30 rounded-md border px-6 py-3 text-base font-bold tracking-wide transition-all hover:shadow-[0_8px_30px_-8px_rgba(200,170,110,0.7)] active:scale-[0.98] disabled:opacity-60"
      >
        {creating ? t("creatingRoom") : t("createRoom")}
        {!creating && (
          <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        )}
      </button>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && join()}
          placeholder={t("roomCodePlaceholder")}
          aria-label={t("roomCodePlaceholder")}
          maxLength={6}
          className="border-line bg-void/70 text-ink placeholder:text-ink-faint focus:border-cyan/60 w-full rounded-md border px-3 py-2.5 text-sm tracking-widest uppercase outline-none"
        />
        <button
          type="button"
          onClick={join}
          className="border-line text-ink hover:border-ink-faint rounded-md border px-5 py-2.5 text-sm font-medium transition-colors"
        >
          {t("joinRoom")}
        </button>
      </div>
      {error && <p className="text-red-side text-xs">{error}</p>}
    </div>
  );
}
