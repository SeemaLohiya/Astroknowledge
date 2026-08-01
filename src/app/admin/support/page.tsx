"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { SupportChat } from "@/components/support/SupportChat";
import { AdminSupportBroadcast } from "@/components/admin/AdminSupportBroadcast";
import { fetchJson } from "@/lib/fetch-json";
import { AdminSupportContact } from "@/lib/support-store";
import { MessageCircle, Search, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function AdminSupportPage() {
  const [threads, setThreads] = useState<AdminSupportContact[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "active">("all");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(id);
  }, [search]);

  const loadThreads = useCallback(async () => {
    const qs = debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : "";
    const res = await fetchJson<{ threads?: AdminSupportContact[] }>(`/api/support/threads${qs}`, {
      cache: "no-store",
    });
    const list = res.data?.threads || [];
    setThreads(list);
    setLoading(false);
    setSelectedId((prev) => {
      if (prev && list.some((t) => t.id === prev)) return prev;
      return prev;
    });
  }, [debouncedSearch]);

  useEffect(() => {
    setLoading(true);
    void loadThreads();
    const id = setInterval(() => void loadThreads(), 8000);
    return () => clearInterval(id);
  }, [loadThreads]);

  const filteredThreads = useMemo(() => {
    if (filter === "unread") return threads.filter((t) => t.unreadByAdmin > 0);
    if (filter === "active") return threads.filter((t) => t.hasMessages);
    return threads;
  }, [threads, filter]);

  const selected = threads.find((t) => t.id === selectedId) || null;
  const unreadCount = threads.filter((t) => t.unreadByAdmin > 0).length;

  const selectThread = async (thread: AdminSupportContact) => {
    setSelectedId(thread.id);
    setMobileShowChat(true);
    if (!thread.hasMessages) {
      await fetchJson("/api/support/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: thread.userId }),
      });
      void loadThreads();
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
        <div className={`overflow-hidden rounded-2xl border border-gold/15 bg-white/90 ${mobileShowChat ? "hidden lg:block" : "block"}`}>
          <div className="border-b border-gold/10 px-3 py-3 sm:px-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold">
                <Users className="h-3.5 w-3.5" />
                All users ({threads.length})
              </p>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#25D366] px-2 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount} unread
                </span>
              )}
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
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(
                [
                  ["all", "All"],
                  ["unread", "Unread"],
                  ["active", "With chats"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    filter === key ? "bg-gold text-white" : "bg-orange/10 text-text-muted hover:bg-gold/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="p-6 text-center text-sm text-text-muted">Loading users…</p>
          ) : filteredThreads.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="mx-auto mb-2 h-8 w-8 text-text-muted" />
              <p className="text-sm text-text-muted">
                {search.trim() ? "No users match your search" : "No users found"}
              </p>
            </div>
          ) : (
            <ul className="max-h-[min(55vh,560px)] overflow-y-auto lg:max-h-[min(70vh,640px)]">
              {filteredThreads.map((t) => {
                const active = t.id === selectedId;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => void selectThread(t)}
                      className={`flex w-full gap-3 border-b border-gold/5 px-3 py-3 text-left transition-colors sm:px-4 ${
                        active ? "bg-gold/10" : "hover:bg-orange/5"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#075e54] text-xs font-bold text-white">
                        {t.userName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-text-primary">{t.userName}</p>
                          {t.unreadByAdmin > 0 ? (
                            <span className="shrink-0 rounded-full bg-[#25D366] px-1.5 py-0.5 text-[10px] font-bold text-white">
                              {t.unreadByAdmin}
                            </span>
                          ) : !t.hasMessages ? (
                            <span className="shrink-0 rounded-full bg-gold/15 px-1.5 py-0.5 text-[10px] font-medium text-gold">
                              New
                            </span>
                          ) : null}
                        </div>
                        <p className="truncate text-[11px] text-text-muted">{t.userEmail}</p>
                        <p className="truncate text-xs text-text-muted">
                          {t.lastMessagePreview || (t.hasMessages ? "No preview" : "Tap to start conversation")}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className={`min-w-0 ${!mobileShowChat ? "hidden lg:block" : "block"}`}>
          {selected && (
            <p className="mb-2 truncate text-xs text-text-muted lg:hidden">
              Chatting with <span className="font-semibold text-text-primary">{selected.userName}</span>
            </p>
          )}
          <SupportChat
            mode="admin"
            threadId={selectedId}
            emptyHint="Search and select a user to start chatting"
            onSent={() => void loadThreads()}
            showBackOnMobile
            onBack={() => setMobileShowChat(false)}
          />
        </div>
      </div>
    </PageTransition>
  );
}
