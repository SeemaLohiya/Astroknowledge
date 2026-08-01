"use client";

import { fetchJson, parseResponseJson } from "@/lib/fetch-json";
import { cn } from "@/lib/cn";
import {
  SupportAttachment,
  SupportMessage,
  SupportThread,
} from "@/lib/types";
import {
  ArrowLeft,
  FileText,
  Link2,
  Paperclip,
  Send,
  Image as ImageIcon,
  Film,
  File,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AttachmentBubble({ attachment }: { attachment: SupportAttachment }) {
  if (attachment.kind === "image") {
    return (
      <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-h-56 max-w-full rounded-lg object-cover"
        />
      </a>
    );
  }
  if (attachment.kind === "video") {
    return (
      <video controls className="max-h-56 max-w-full rounded-lg" src={attachment.url}>
        <track kind="captions" />
      </video>
    );
  }
  if (attachment.kind === "link") {
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex max-w-full items-center gap-2 break-all text-sm font-medium underline"
      >
        <Link2 className="h-4 w-4 shrink-0" />
        {attachment.name || attachment.url}
      </a>
    );
  }
  const Icon = attachment.kind === "pdf" ? FileText : attachment.kind === "doc" ? FileText : File;
  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex max-w-full items-center gap-2 rounded-lg bg-black/5 px-3 py-2 text-sm font-medium hover:bg-black/10"
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{attachment.name}</span>
    </a>
  );
}

function linkify(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline break-all">
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

type SupportChatProps = {
  mode: "user" | "admin";
  /** Admin: selected thread id */
  threadId?: string | null;
  emptyHint?: string;
  onSent?: () => void;
  onBack?: () => void;
  showBackOnMobile?: boolean;
};

export function SupportChat({ mode, threadId, emptyHint, onSent, onBack, showBackOnMobile }: SupportChatProps) {
  const [thread, setThread] = useState<SupportThread | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [text, setText] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const activeThreadId = mode === "admin" ? threadId : thread?.id;

  const load = useCallback(async () => {
    if (mode === "admin" && !threadId) {
      setThread(null);
      setMessages([]);
      setLoadError(null);
      setLoading(false);
      return;
    }

    try {
      if (mode === "user") {
        const threadsRes = await fetchJson<{ thread?: SupportThread }>("/api/support/threads", {
          cache: "no-store",
        });
        if (!threadsRes.ok) {
          throw new Error(threadsRes.error || "Could not load support chat");
        }
        const t = threadsRes.data?.thread;
        if (!t) {
          throw new Error("Could not start support conversation");
        }
        setThread(t);
        const msgRes = await fetchJson<{ thread?: SupportThread; messages?: SupportMessage[] }>(
          `/api/support/messages?threadId=${encodeURIComponent(t.id)}`,
          { cache: "no-store" }
        );
        if (!msgRes.ok) {
          throw new Error(msgRes.error || "Could not load messages");
        }
        if (msgRes.data?.thread) setThread(msgRes.data.thread);
        setMessages(msgRes.data?.messages || []);
        setLoadError(null);
        setLoading(false);
        return;
      }

      const msgRes = await fetchJson<{ thread?: SupportThread; messages?: SupportMessage[] }>(
        `/api/support/messages?threadId=${encodeURIComponent(threadId!)}`,
        { cache: "no-store" }
      );
      if (!msgRes.ok) {
        throw new Error(msgRes.error || "Could not load messages");
      }
      setThread(msgRes.data?.thread || null);
      setMessages(msgRes.data?.messages || []);
      setLoadError(null);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load chat");
    } finally {
      setLoading(false);
    }
  }, [mode, threadId]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  useEffect(() => {
    if (!activeThreadId && mode === "admin") return;
    const id = setInterval(() => {
      void load();
    }, 4000);
    return () => clearInterval(id);
  }, [load, activeThreadId, mode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = async () => {
    if (sending) return;
    if (!text.trim() && !pendingFile) return;
    if (mode === "admin" && !threadId) {
      toast.error("Select a conversation first");
      return;
    }

    setSending(true);
    try {
      let attachment: SupportAttachment | undefined;
      if (pendingFile) {
        const fd = new FormData();
        fd.append("file", pendingFile);
        const up = await fetch("/api/support/upload", { method: "POST", body: fd });
        const upData = await parseResponseJson<{ attachment?: SupportAttachment; error?: string }>(up);
        if (!up.ok || !upData?.attachment) throw new Error(upData?.error || "Upload failed");
        attachment = upData.attachment;
      }

      const res = await fetch("/api/support/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: mode === "admin" ? threadId : undefined,
          text: text.trim() || undefined,
          attachment,
        }),
      });
      const data = await parseResponseJson<{
        thread?: SupportThread;
        message?: SupportMessage;
        error?: string;
      }>(res);
      if (!res.ok) throw new Error(data?.error || "Send failed");
      if (data?.thread) setThread(data.thread);
      if (data?.message) setMessages((prev) => [...prev, data.message!]);
      setText("");
      setPendingFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setLoadError(null);
      onSent?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Send failed");
    } finally {
      setSending(false);
    }
  };

  const chatShell = "flex h-[min(60vh,640px)] flex-col overflow-hidden rounded-2xl border border-gold/20 bg-[#efeae2] shadow-sm sm:h-[min(70vh,640px)]";

  if (mode === "admin" && !threadId) {
    return (
      <div className={`${chatShell} items-center justify-center p-8 text-center text-sm text-text-muted`}>
        {emptyHint || "Select a user conversation to reply"}
      </div>
    );
  }

  if (loadError && !thread) {
    return (
      <div className={`${chatShell} flex-col items-center justify-center gap-3 p-8 text-center`}>
        <p className="text-sm text-red-600">{loadError}</p>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setLoadError(null);
            void load();
          }}
          className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`${chatShell} items-center justify-center text-sm text-text-muted`}>
        Loading chat…
      </div>
    );
  }

  const headerName = mode === "admin" ? thread?.userName || "User" : "AstroKnowledge Support";
  const headerInitials = (mode === "admin" ? thread?.userName || "U" : "AK").slice(0, 2).toUpperCase();

  return (
    <div className={chatShell}>
      <div className="flex items-center gap-2 border-b border-black/5 bg-[#075e54] px-3 py-3 text-white sm:gap-3 sm:px-4">
        {showBackOnMobile && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-full p-1.5 hover:bg-white/10 lg:hidden"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
          {headerInitials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{headerName}</p>
          <p className="truncate text-xs text-white/70">
            {mode === "admin" ? thread?.userEmail : "Usually replies within a few hours"}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {messages.length === 0 ? (
          <p className="py-12 text-center text-sm text-text-muted">
            No messages yet. Say hello to start the conversation.
          </p>
        ) : (
          messages.map((m) => {
            const mine =
              (mode === "user" && m.senderRole === "user") ||
              (mode === "admin" && m.senderRole === "admin");
            return (
              <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 shadow-sm",
                    mine ? "rounded-tr-none bg-[#dcf8c6]" : "rounded-tl-none bg-white"
                  )}
                >
                  {mode === "admin" && (
                    <p className="mb-0.5 text-[10px] font-semibold text-text-muted">{m.senderName}</p>
                  )}
                  {m.attachment && <AttachmentBubble attachment={m.attachment} />}
                  {m.text && (
                    <p className={cn("whitespace-pre-wrap text-sm text-text-primary", m.attachment && "mt-2")}>
                      {linkify(m.text)}
                    </p>
                  )}
                  <p className="mt-1 text-right text-[10px] text-text-muted">{formatTime(m.createdAt)}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {pendingFile && (
        <div className="flex items-center gap-2 border-t border-black/5 bg-white/80 px-3 py-2 text-xs text-text-body">
          <Paperclip className="h-3.5 w-3.5 text-gold" />
          <span className="truncate">{pendingFile.name}</span>
          <button
            type="button"
            onClick={() => {
              setPendingFile(null);
              if (fileRef.current) fileRef.current.value = "";
            }}
            className="ml-auto rounded-full p-1 hover:bg-black/5"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 border-t border-black/5 bg-[#f0f2f5] px-3 py-2">
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept="image/*,video/mp4,video/webm,video/quicktime,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
          onChange={(e) => setPendingFile(e.target.files?.[0] || null)}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-full p-2 text-text-muted hover:bg-black/5 hover:text-gold"
          title="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <div className="hidden gap-1 sm:flex">
          <button
            type="button"
            onClick={() => {
              if (fileRef.current) {
                fileRef.current.accept = "image/*";
                fileRef.current.click();
                fileRef.current.accept =
                  "image/*,video/mp4,video/webm,video/quicktime,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip";
              }
            }}
            className="rounded-full p-2 text-text-muted hover:bg-black/5"
            title="Image"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (fileRef.current) {
                fileRef.current.accept = "video/*";
                fileRef.current.click();
                fileRef.current.accept =
                  "image/*,video/mp4,video/webm,video/quicktime,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip";
              }
            }}
            className="rounded-full p-2 text-text-muted hover:bg-black/5"
            title="Video"
          >
            <Film className="h-4 w-4" />
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          rows={1}
          placeholder="Type a message or paste a link…"
          className="max-h-28 min-h-[40px] flex-1 resize-none rounded-2xl border-0 bg-white px-4 py-2.5 text-sm text-text-primary outline-none ring-1 ring-black/5 focus:ring-gold/40"
        />
        <button
          type="button"
          disabled={sending || (!text.trim() && !pendingFile)}
          onClick={() => void send()}
          className="rounded-full bg-[#075e54] p-2.5 text-white disabled:opacity-40"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
