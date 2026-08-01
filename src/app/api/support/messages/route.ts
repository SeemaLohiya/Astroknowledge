import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { logNotification } from "@/lib/notifications-store";
import { store } from "@/lib/store";
import { supportStore } from "@/lib/support-store";
import { SupportAttachment, SupportAttachmentKind } from "@/lib/types";

function previewForNotification(text?: string, attachment?: SupportAttachment): string {
  if (text?.trim()) return text.trim().slice(0, 100);
  if (!attachment) return "New message";
  if (attachment.kind === "image") return "Sent a photo";
  if (attachment.kind === "video") return "Sent a video";
  if (attachment.kind === "pdf") return "Sent a PDF";
  if (attachment.kind === "link") return `Shared a link: ${attachment.name || attachment.url}`.slice(0, 100);
  return `Sent a file: ${attachment.name}`;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const threadId = req.nextUrl.searchParams.get("threadId");
    if (!threadId) {
      return NextResponse.json({ error: "threadId required" }, { status: 400 });
    }

    const thread = await supportStore.getThread(threadId);
    if (!thread) return NextResponse.json({ error: "Thread not found" }, { status: 404 });

    if (session.role !== "admin" && thread.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await supportStore.getMessages(threadId);
    const readerRole = session.role === "admin" ? "admin" : "user";
    const updatedThread = await supportStore.markRead(threadId, readerRole);

    return NextResponse.json({ messages, thread: updatedThread || thread });
  } catch (err) {
    console.error("[support/messages GET]", err);
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}

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

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const attachment = normalizeAttachment(body.attachment);
    const requestedThreadId = typeof body.threadId === "string" ? body.threadId.trim() : "";

    let thread;
    if (session.role === "admin" && requestedThreadId) {
      thread = await supportStore.getThread(requestedThreadId);
      if (!thread) return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    } else {
      const user = await store.users.findById(session.userId);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      thread = await supportStore.ensureThread({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    }

    if (!text && !attachment) {
      return NextResponse.json({ error: "Message or attachment required" }, { status: 400 });
    }

    const senderRole = session.role === "admin" ? "admin" : "user";

    const { message, thread: updatedThread } = await supportStore.addMessage({
      threadId: thread.id,
      senderId: session.userId,
      senderRole,
      senderName: session.name,
      text: text || undefined,
      attachment,
    });

    const preview = previewForNotification(text, attachment);
    if (senderRole === "user") {
      await logNotification({
        type: "support_message",
        userId: updatedThread.userId,
        userName: updatedThread.userName,
        referenceId: updatedThread.id,
        message: `${session.name} sent a support message: ${preview}`,
        channel: "system",
      });
    } else {
      await logNotification({
        type: "support_message",
        userId: updatedThread.userId,
        userName: updatedThread.userName,
        referenceId: updatedThread.id,
        message: `Support replied to you: ${preview}`,
        channel: "system",
      });
    }

    return NextResponse.json({ message, thread: updatedThread });
  } catch (err) {
    console.error("[support/messages POST]", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
