import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { store } from "@/lib/store";
import { supportStore } from "@/lib/support-store";
import { SupportThread } from "@/lib/types";

function placeholderThread(user: { id: string; name: string; email: string; createdAt?: string }): SupportThread {
  const created = user.createdAt || new Date().toISOString();
  return {
    id: `thread-${user.id}`,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    lastMessageAt: "",
    lastMessagePreview: "",
    unreadByAdmin: 0,
    unreadByUser: 0,
    createdAt: created,
    updatedAt: created,
  };
}

function sortAdminThreads(threads: SupportThread[]): SupportThread[] {
  return [...threads].sort((a, b) => {
    const aHasChat = Boolean(a.lastMessagePreview?.trim());
    const bHasChat = Boolean(b.lastMessagePreview?.trim());
    if (aHasChat && bHasChat) return b.lastMessageAt.localeCompare(a.lastMessageAt);
    if (aHasChat) return -1;
    if (bHasChat) return 1;
    return a.userName.localeCompare(b.userName, undefined, { sensitivity: "base" });
  });
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.role === "admin") {
      const search = req.nextUrl.searchParams.get("search")?.trim().toLowerCase() || "";
      const threads = await supportStore.listThreads();
      const threadByUserId = new Map(threads.map((t) => [t.userId, t]));
      const users = (await store.users.getAll()).filter((u) => u.role === "user");
      let contacts = users.map((user) => threadByUserId.get(user.id) || placeholderThread(user));

      if (search) {
        const usersById = new Map(users.map((u) => [u.id, u]));
        contacts = contacts.filter((t) => {
          const u = usersById.get(t.userId);
          return (
            t.userName.toLowerCase().includes(search) ||
            t.userEmail.toLowerCase().includes(search) ||
            (u?.phone || "").toLowerCase().includes(search)
          );
        });
      }

      return NextResponse.json({ threads: sortAdminThreads(contacts) });
    }

    const user = await store.users.findById(session.userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const thread = await supportStore.ensureThread({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return NextResponse.json({ thread });
  } catch (err) {
    console.error("[support/threads GET]", err);
    return NextResponse.json({ error: "Failed to load support threads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const userId = typeof body.userId === "string" ? body.userId.trim() : "";
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const user = await store.users.findById(userId);
    if (!user || user.role !== "user") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const thread = await supportStore.ensureThread({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return NextResponse.json({ thread });
  } catch (err) {
    console.error("[support/threads POST]", err);
    return NextResponse.json({ error: "Failed to start conversation" }, { status: 500 });
  }
}
