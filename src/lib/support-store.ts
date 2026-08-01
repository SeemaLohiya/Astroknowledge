import { isRemotePersistEnabled } from "./db/persist";
import * as mongoMeta from "./db/mongo-meta-repo";
import { readJsonFile, writeJsonFile } from "./json-store";
import { SupportMessage, SupportThread } from "./types";

type SupportData = {
  threads: SupportThread[];
  messages: SupportMessage[];
};

const EMPTY: SupportData = { threads: [], messages: [] };

async function load(): Promise<SupportData> {
  if (isRemotePersistEnabled()) return mongoMeta.mongoGetSupport();
  return readJsonFile<SupportData>("support.json", EMPTY);
}

async function save(data: SupportData) {
  if (isRemotePersistEnabled()) {
    await mongoMeta.mongoSaveSupport(data);
    return;
  }
  writeJsonFile("support.json", data);
}

function previewOf(msg: SupportMessage): string {
  if (msg.text?.trim()) return msg.text.trim().slice(0, 120);
  if (msg.attachment) {
    const kind = msg.attachment.kind;
    if (kind === "image") return "📷 Photo";
    if (kind === "video") return "🎬 Video";
    if (kind === "pdf") return "📄 PDF";
    if (kind === "doc") return "📎 Document";
    if (kind === "link") return "🔗 Link";
    return `📎 ${msg.attachment.name}`;
  }
  return "New message";
}

export const supportStore = {
  async listThreads(): Promise<SupportThread[]> {
    const data = await load();
    return [...data.threads].sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
  },

  async getThread(threadId: string): Promise<SupportThread | null> {
    const data = await load();
    return data.threads.find((t) => t.id === threadId) || null;
  },

  async getThreadByUser(userId: string): Promise<SupportThread | null> {
    const data = await load();
    return data.threads.find((t) => t.userId === userId) || null;
  },

  async ensureThread(user: {
    id: string;
    name: string;
    email: string;
  }): Promise<SupportThread> {
    const data = await load();
    const existing = data.threads.find((t) => t.userId === user.id);
    if (existing) {
      existing.userName = user.name;
      existing.userEmail = user.email;
      await save(data);
      return existing;
    }
    const now = new Date().toISOString();
    const thread: SupportThread = {
      id: `thread-${user.id}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      lastMessageAt: now,
      lastMessagePreview: "",
      unreadByAdmin: 0,
      unreadByUser: 0,
      createdAt: now,
      updatedAt: now,
    };
    data.threads.unshift(thread);
    await save(data);
    return thread;
  },

  async getMessages(threadId: string): Promise<SupportMessage[]> {
    const data = await load();
    return data.messages
      .filter((m) => m.threadId === threadId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  async addMessage(input: {
    threadId: string;
    senderId: string;
    senderRole: "user" | "admin";
    senderName: string;
    text?: string;
    attachment?: SupportMessage["attachment"];
  }): Promise<{ thread: SupportThread; message: SupportMessage }> {
    const data = await load();
    const thread = data.threads.find((t) => t.id === input.threadId);
    if (!thread) throw new Error("Thread not found");

    const now = new Date().toISOString();
    const message: SupportMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      threadId: input.threadId,
      senderId: input.senderId,
      senderRole: input.senderRole,
      senderName: input.senderName,
      text: input.text?.trim() || undefined,
      attachment: input.attachment,
      createdAt: now,
    };

    data.messages.push(message);
    thread.lastMessageAt = now;
    thread.lastMessagePreview = previewOf(message);
    thread.updatedAt = now;
    if (input.senderRole === "user") {
      thread.unreadByAdmin += 1;
    } else {
      thread.unreadByUser += 1;
    }

    await save(data);
    return { thread, message };
  },

  async markRead(threadId: string, role: "user" | "admin"): Promise<SupportThread | null> {
    const data = await load();
    const thread = data.threads.find((t) => t.id === threadId);
    if (!thread) return null;
    if (role === "admin") thread.unreadByAdmin = 0;
    else thread.unreadByUser = 0;
    thread.updatedAt = new Date().toISOString();
    await save(data);
    return thread;
  },

  async broadcastToUsers(input: {
    users: { id: string; name: string; email: string }[];
    senderId: string;
    senderName: string;
    text?: string;
    attachment?: SupportMessage["attachment"];
  }): Promise<{ sent: number }> {
    let sent = 0;
    for (const user of input.users) {
      const thread = await this.ensureThread(user);
      await this.addMessage({
        threadId: thread.id,
        senderId: input.senderId,
        senderRole: "admin",
        senderName: input.senderName,
        text: input.text,
        attachment: input.attachment,
      });
      sent += 1;
    }
    return { sent };
  },
};
