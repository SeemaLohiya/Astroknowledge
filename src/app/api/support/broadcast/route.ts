import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { getSession } from "@/lib/auth";
import { logNotification } from "@/lib/notifications-store";
import { store } from "@/lib/store";
import { supportStore } from "@/lib/support-store";
import { SupportAttachment, SupportAttachmentKind } from "@/lib/types";

function detectLinkKind(url: string): SupportAttachmentKind {
  const lower = url.toLowerCase();
  if (/\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(lower)) return "image";
  if (/\.(mp4|webm|mov)(\?|$)/i.test(lower)) return "video";
  if (/\.pdf(\?|$)/i.test(lower)) return "pdf";
  if (/\.(doc|docx)(\?|$)/i.test(lower)) return "doc";
  return "link";
}

function normalizeAttachment(raw: unknown): SupportAttachment | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const a = raw as Record<string, unknown>;
  const url = typeof a.url === "string" ? a.url.trim() : "";
  if (!url) return undefined;

  const kind = (a.kind as SupportAttachmentKind) || detectLinkKind(url);
  return {
    url,
    kind,
    name: typeof a.name === "string" ? a.name.trim() || "Attachment" : "Attachment",
    mimeType: typeof a.mimeType === "string" ? a.mimeType : "application/octet-stream",
    size: typeof a.size === "number" ? a.size : 0,
  };
}

function previewForNotification(text?: string, attachment?: SupportAttachment): string {
  if (text?.trim()) return text.trim().slice(0, 100);
  if (!attachment) return "New message";
  if (attachment.kind === "image") return "Sent a photo";
  if (attachment.kind === "video") return "Sent a video";
  if (attachment.kind === "pdf") return "Sent a PDF";
  if (attachment.kind === "link") return `Shared a link: ${attachment.name || attachment.url}`.slice(0, 100);
  return `Sent a file: ${attachment.name}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const attachment = normalizeAttachment(body.attachment);

    if (!text && !attachment) {
      return NextResponse.json({ error: "Message or attachment required" }, { status: 400 });
    }

    const users = (await store.users.getAll())
      .filter((u) => u.role === "user")
      .map((u) => ({ id: u.id, name: u.name, email: u.email }));

    if (!users.length) {
      return NextResponse.json({ error: "No users to message" }, { status: 400 });
    }

    const { sent } = await supportStore.broadcastToUsers({
      users,
      senderId: session.userId,
      senderName: session.name,
      text: text || undefined,
      attachment,
    });

    const preview = previewForNotification(text, attachment);
    for (const user of users) {
      await logNotification({
        type: "support_message",
        userId: user.id,
        userName: user.name,
        referenceId: `thread-${user.id}`,
        message: `Support message from admin: ${preview}`,
        channel: "system",
      });
    }

    return NextResponse.json({ sent, total: users.length });
  } catch (err) {
    console.error("[support/broadcast POST]", err);
    return NextResponse.json({ error: "Failed to broadcast message" }, { status: 500 });
  }
}
