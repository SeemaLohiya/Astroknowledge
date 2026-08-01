import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { store } from "@/lib/store";
import { supportStore } from "@/lib/support-store";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.role === "admin") {
      const threads = await supportStore.listThreads();
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
