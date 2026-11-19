"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { ensureAnonSession, getSupabaseClient, parseRoom } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { roleForUid } from "@/lib/room";
import type { Role, Room } from "@/lib/types";

export type ConnectionState = "connecting" | "connected" | "reconnecting";

interface UseRoomResult {
  configured: boolean;
  loading: boolean;
  room: Room | null;
  uid: string | null;
  role: Role;
  connection: ConnectionState;
  presence: { blueOnline: boolean; redOnline: boolean; spectators: number };
  error: string | null;
  actionError: string | null;
  select: (championId: string) => void;
  undo: () => void;
  confirmGame: () => void;
  resetGame: () => void;
  resetSeries: () => void;
}

function rowFromRpc(data: unknown): Room {
  return parseRoom(Array.isArray(data) ? data[0] : data);
}

export function useRoom(code: string): UseRoomResult {
  const configured = isSupabaseConfigured();
  const [loading, setLoading] = useState(configured);
  const [room, setRoom] = useState<Room | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [onlineUids, setOnlineUids] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(configured ? null : "config");
  const [actionError, setActionError] = useState<string | null>(null);

  const channelsRef = useRef<RealtimeChannel[]>([]);

  useEffect(() => {
    if (!configured) return;

    let active = true;
    const supabase = getSupabaseClient();

    async function init() {
      try {
        const myUid = await ensureAnonSession();
        if (!active) return;
        setUid(myUid);

        const { data, error: joinError } = await supabase.rpc("join_room", { p_code: code });
        if (!active) return;
        if (joinError) {
          setError(joinError.message);
          setLoading(false);
          return;
        }
        if (!data || (Array.isArray(data) && data.length === 0)) {
          setError("not-found");
          setLoading(false);
          return;
        }
        setRoom(rowFromRpc(data));
        setLoading(false);

        const dbChannel = supabase
          .channel(`room-db-${code}`)
          .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "rooms", filter: `code=eq.${code}` },
            (payload) => {
              try {
                setRoom(parseRoom(payload.new));
              } catch {
                // Ignore malformed payloads; the next refresh will reconcile.
              }
            },
          )
          .subscribe();

        const presenceChannel = supabase.channel(`room-presence-${code}`, {
          config: { presence: { key: myUid } },
        });
        presenceChannel.on("presence", { event: "sync" }, () => {
          setOnlineUids(Object.keys(presenceChannel.presenceState()));
        });
        presenceChannel.subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            setConnection("connected");
            await presenceChannel.track({ uid: myUid });
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            setConnection("reconnecting");
          }
        });

        channelsRef.current = [dbChannel, presenceChannel];
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Unexpected error");
        setLoading(false);
      }
    }

    init();

    return () => {
      active = false;
      for (const channel of channelsRef.current) {
        supabase.removeChannel(channel);
      }
      channelsRef.current = [];
    };
  }, [code, configured]);

  const role = useMemo<Role>(
    () => (room && uid ? roleForUid(room, uid) : "spectator"),
    [room, uid],
  );

  const presence = useMemo(() => {
    const online = new Set(onlineUids);
    return {
      blueOnline: Boolean(room?.blueCaptain && online.has(room.blueCaptain)),
      redOnline: Boolean(room?.redCaptain && online.has(room.redCaptain)),
      spectators: onlineUids.filter((id) => id !== room?.blueCaptain && id !== room?.redCaptain)
        .length,
    };
  }, [onlineUids, room]);

  const runAction = useCallback(
    async (rpc: () => PromiseLike<{ data: unknown; error: { message: string } | null }>) => {
      try {
        const { data, error: rpcError } = await rpc();
        if (rpcError) {
          setActionError(rpcError.message);
          return;
        }
        if (data) {
          setRoom(rowFromRpc(data));
          setActionError(null);
        }
      } catch (e) {
        setActionError(e instanceof Error ? e.message : "Action failed");
      }
    },
    [],
  );

  const select = useCallback(
    (championId: string) => {
      runAction(() =>
        getSupabaseClient().rpc("draft_select", { p_code: code, p_champion: championId }),
      );
    },
    [code, runAction],
  );
  const undo = useCallback(() => {
    runAction(() => getSupabaseClient().rpc("draft_undo", { p_code: code }));
  }, [code, runAction]);
  const confirmGame = useCallback(() => {
    runAction(() => getSupabaseClient().rpc("draft_confirm_game", { p_code: code }));
  }, [code, runAction]);
  const resetGame = useCallback(() => {
    runAction(() => getSupabaseClient().rpc("draft_reset_game", { p_code: code }));
  }, [code, runAction]);
  const resetSeries = useCallback(() => {
    runAction(() => getSupabaseClient().rpc("draft_reset_series", { p_code: code }));
  }, [code, runAction]);

  return {
    configured,
    loading,
    room,
    uid,
    role,
    connection,
    presence,
    error,
    actionError,
    select,
    undo,
    confirmGame,
    resetGame,
    resetSeries,
  };
}
