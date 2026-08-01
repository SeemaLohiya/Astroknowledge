"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { SupportChat } from "@/components/support/SupportChat";
import { AdminSupportBroadcast } from "@/components/admin/AdminSupportBroadcast";
import { cn } from "@/lib/cn";
import { fetchJson } from "@/lib/fetch-json";
import { SupportThread } from "@/lib/types";
import { MessageCircle, Search, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function AdminSupportPage() {
  const [threads, setThreads] = useState<SupportThread[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [starting, setStarting] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(id);
  }, [search]);

  const loadThreads = useCallback(async () => {
    const qs = debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : "";
    const res = await fetchJson<{ threads?: SupportThread[] }>(`/api/support/threads${qs}`, {
      cache: "no-store",
    });
    const list = res.data?.threads || [];
    setThreads(list);
    setLoading(false);
    setSelectedId((prev) => {
      if (prev && list.some((t) => t.id === prev)) return prev;
      return null;
    });
  }, [debouncedSearch]);

  useEffect(() => {
    setLoading(true);
    void loadThreads();
    const id = setInterval(() => void loadThreads(), 8000);
    return () => clearInterval(id);
  }, [loadThreads]);

  const stats = useMemo(() => {
    const withChat = threads.filter((t) => t.lastMessagePreview?.trim()).length;
    return { total: threads.length, withChat };
  }, [threads]);

  const selectThread = async (thread: SupportThread) => {
    setStarting(thread.userId);
    try {
      const res = await fetchJson<{ thread?: SupportThread }>("/api/support/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: thread.userId }),
      });
      const nextId = res.data?.thread?.id || thread.id;
      setSelectedId(nextId);
      setMobileChatOpen(true);
      void loadThreads();
    } finally {
      setStarting(null);
    }
  };

  return (
    <PageTransition>
      <FadeIn className="mb-4">
        <h1 className="font-display text-xl font-bold text-text-primary sm:text-2xl">
          Support <span className="text-gradient-gold">Inbox</span>
        </h1>
        <p className="mt-1 text-xs text-text-muted sm:text-sm">
          Chat with any user — search by name, email, or phone to start a conversation.
        </p>
      </FadeIn>

      <AdminSupportBroadcast onSent={() => void loadThreads()} />

      <div className="grid gap-4 lg:grid-cols-[minmax(260px,320px)_1fr]">
        <div className={cn(mobileChatOpen && "hidden", "overflow-hidden rounded-2xl border border-gold/15 bg-white/90 lg:block")}>
          <div className="border-b border-gold/10 px-3 py-3 sm:px-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-gold">All users</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold">
                <Users className="h-3 w-3" />
                {stats.total}
              </span>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, phone…"
                className="w-full rounded-xl border border-gold/20 bg-orange/5 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-gold"
              />
            </div>
            <p className="mt-2 text-[10px] text-text-muted">
              {stats.withChat} with messages · {stats.total - stats.withChat} not started yet
            </p>
          </div>

          {loading ? (
            <p className="p-6 text-center text-sm text-text-muted">Loading users…</p>
          ) : threads.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="mx-auto mb-2 h-8 w-8 text-text-muted" />
              <p className="text-sm text-text-muted">
                {debouncedSearch ? "No users match your search" : "No users found"}
              </p>
            </div>
          ) : (
            <ul className="max-h-[min(calc(100dvh-18rem),640px)] overflow-y-auto">
              {threads.map((t) => {
                const active = t.id === selectedId;
                const isNew = !t.lastMessagePreview?.trim();
                const busy = starting === t.userId;
                return (
                  <li key={t.userId}>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void selectThread(t)}
                      className={cn(
                        "flex w-full gap-3 border-b border-gold/5 px-3 py-3 text-left transition-colors disabled:opacity-60",
                        active ? "bg-gold/10" : "hover:bg-orange/5"
                      )}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#075e54] text-xs font-bold text-white">
                        {t.userName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-text-primary">{t.userName}</p>
                          {t.unreadByAdmin > 0 ? (
                            <span className="rounded-full bg-[#25D366] px-1.5 py-0.5 text-[10px] font-bold text-white">
                              {t.unreadByAdmin}
                            </span>
                          ) : isNew ? (
                            <span className="rounded-full bg-gold/15 px-1.5 py-0.5 text-[10px] font-medium text-gold">
                              New
                            </span>
                          ) : null}
                        </div>
                        <p className="truncate text-[11px] text-text-muted">{t.userEmail}</p>
                        <p className="truncate text-xs text-text-muted">
                          {busy
                            ? "Opening…"
                            : isNew
                              ? "Tap to start conversation"
                              : t.lastMessagePreview}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className={cn(!mobileChatOpen && "hidden", "lg:block")}>
          <SupportChat
            mode="admin"
            threadId={selectedId}
            emptyHint="Search and select a user to start chatting"
            onSent={() => void loadThreads()}
            onBack={() => {
              setMobileChatOpen(false);
              setSelectedId(null);
            }}
          />
        </div>
      </div>
    </PageTransition>
  );
}
