"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { SupportChat } from "@/components/support/SupportChat";
import { fetchJson } from "@/lib/fetch-json";
import { SupportThread } from "@/lib/types";
import { MessageCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function AdminSupportPage() {
  const [threads, setThreads] = useState<SupportThread[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadThreads = useCallback(async () => {
    const res = await fetchJson<{ threads?: SupportThread[] }>("/api/support/threads", {
      cache: "no-store",
    });
    const list = res.data?.threads || [];
    setThreads(list);
    setLoading(false);
    setSelectedId((prev) => {
      if (prev && list.some((t) => t.id === prev)) return prev;
      return list[0]?.id || null;
    });
  }, []);

  useEffect(() => {
    void loadThreads();
    const id = setInterval(() => void loadThreads(), 5000);
    return () => clearInterval(id);
  }, [loadThreads]);

  return (
    <PageTransition>
      <FadeIn className="mb-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Support <span className="text-gradient-gold">Inbox</span>
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          WhatsApp-style chat with users — reply with text, links, images, video, PDF, or docs.
        </p>
      </FadeIn>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-gold/15 bg-white/90">
          <div className="border-b border-gold/10 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gold">Conversations</p>
          </div>
          {loading ? (
            <p className="p-6 text-center text-sm text-text-muted">Loading…</p>
          ) : threads.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="mx-auto mb-2 h-8 w-8 text-text-muted" />
              <p className="text-sm text-text-muted">No support chats yet</p>
            </div>
          ) : (
            <ul className="max-h-[min(70vh,640px)] overflow-y-auto">
              {threads.map((t) => {
                const active = t.id === selectedId;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(t.id)}
                      className={`flex w-full gap-3 border-b border-gold/5 px-3 py-3 text-left transition-colors ${
                        active ? "bg-gold/10" : "hover:bg-orange/5"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#075e54] text-xs font-bold text-white">
                        {t.userName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-text-primary">{t.userName}</p>
                          {t.unreadByAdmin > 0 && (
                            <span className="rounded-full bg-[#25D366] px-1.5 py-0.5 text-[10px] font-bold text-white">
                              {t.unreadByAdmin}
                            </span>
                          )}
                        </div>
                        <p className="truncate text-xs text-text-muted">
                          {t.lastMessagePreview || "No messages yet"}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <SupportChat
          mode="admin"
          threadId={selectedId}
          emptyHint="Select a conversation from the left"
          onSent={() => void loadThreads()}
        />
      </div>
    </PageTransition>
  );
}
