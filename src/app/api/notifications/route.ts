import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { notificationsStore } from "@/lib/notifications-store";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mine = req.nextUrl.searchParams.get("mine") === "1";
  const all = await notificationsStore.getAll();

  if (mine) {
    const notifications = all.filter((n) => n.userId === session.userId);
    return NextResponse.json({ notifications });
  }

  if (session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ notifications: all });
}
