"use client";

import { fetchJson } from "@/lib/fetch-json";
import { SupportThread } from "@/lib/types";
import { useEffect, useState } from "react";

/** Poll support thread unread counts for nav badges */
export function useSupportUnread(mode: "user" | "admin") {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const res = await fetchJson<{ thread?: SupportThread; threads?: SupportThread[] }>(
        "/api/support/threads",
        { cache: "no-store" }
      );
      if (!res.ok) return;
      if (mode === "user") {
        setCount(res.data?.thread?.unreadByUser || 0);
      } else {
        const threads = res.data?.threads || [];
        setCount(threads.reduce((sum, t) => sum + (t.unreadByAdmin || 0), 0));
      }
    };
    void load();
    const id = setInterval(() => void load(), 12000);
    return () => clearInterval(id);
  }, [mode]);

  return count;
}
