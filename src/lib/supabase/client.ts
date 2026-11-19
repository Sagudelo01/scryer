import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { roomRowSchema } from "@/lib/schemas";
import type { Room } from "@/lib/types";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

let client: SupabaseClient | null = null;

/** Lazily create a singleton browser client. Throws if env is missing. */
export function getSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }
  if (!client) {
    client = createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return client;
}

/** Ensure an anonymous session exists and return the user id. */
export async function ensureAnonSession(): Promise<string> {
  const supabase = getSupabaseClient();
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) {
    return data.session.user.id;
  }
  const { data: signedIn, error } = await supabase.auth.signInAnonymously();
  if (error || !signedIn.user) {
    throw new Error(error?.message ?? "Anonymous sign-in failed");
  }
  return signedIn.user.id;
}

/** Validate a raw Supabase row with Zod and map it to the app's Room shape. */
export function parseRoom(raw: unknown): Room {
  const row = roomRowSchema.parse(raw);
  return {
    id: row.id,
    code: row.code,
    status: row.status,
    blueCaptain: row.blue_captain,
    redCaptain: row.red_captain,
    state: row.state,
    updatedAt: row.updated_at,
  };
}
