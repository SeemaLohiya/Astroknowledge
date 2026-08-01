"use client";

import { Button } from "@/components/ui/Button";
import { parseResponseJson } from "@/lib/fetch-json";
import { SupportAttachment } from "@/lib/types";
import { Megaphone, Paperclip, Send, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

type AdminSupportBroadcastProps = {
  onSent?: () => void;
};

export function AdminSupportBroadcast({ onSent }: AdminSupportBroadcastProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const send = async () => {
    if (!text.trim() && !pendingFile) {
      toast.error("Enter a message or attach a file");
      return;
    }
    if (!confirm("Send this message to all users?")) return;

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

      const res = await fetch("/api/support/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() || undefined, attachment }),
      });
      const data = await parseResponseJson<{ sent?: number; total?: number; error?: string }>(res);
      if (!res.ok) throw new Error(data?.error || "Broadcast failed");

      toast.success(`Message sent to ${data?.sent ?? 0} users`);
      setText("");
      setPendingFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setOpen(false);
      onSent?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Broadcast failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mb-4 rounded-2xl border border-gold/20 bg-white/90 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-gold" />
          <div>
            <p className="text-sm font-semibold text-text-primary">Message all users</p>
            <p className="text-xs text-text-muted">Broadcast support text, links, or attachments to every user</p>
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Compose broadcast"}
        </Button>
      </div>

      {open && (
        <div className="mt-4 space-y-3 border-t border-gold/10 pt-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Type your message to all users…"
            className="w-full rounded-xl border border-gold/20 bg-orange/5 px-4 py-3 text-sm"
          />
          {pendingFile && (
            <div className="flex items-center gap-2 rounded-xl border border-gold/15 bg-orange/5 px-3 py-2 text-xs">
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
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept="image/*,video/mp4,video/webm,video/quicktime,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
              onChange={(e) => setPendingFile(e.target.files?.[0] || null)}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Paperclip className="h-4 w-4" /> Attach file
            </Button>
            <Button type="button" variant="secondary" size="sm" disabled={sending} onClick={() => void send()}>
              <Send className="h-4 w-4" /> {sending ? "Sending…" : "Send to all users"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
