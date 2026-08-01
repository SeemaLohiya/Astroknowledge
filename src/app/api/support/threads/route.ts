import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { store } from "@/lib/store";
import { supportStore } from "@/lib/support-store";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.role === "admin") {
      const search = req.nextUrl.searchParams.get("search") || "";
      const threads = await supportStore.listAdminInbox(search);
      return NextResponse.json({ threads });
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
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

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
