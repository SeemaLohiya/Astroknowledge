import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { store } from "@/lib/store";
import { sanitizeUser } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });

  const user = store.users.findById(session.userId);
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({ user: sanitizeUser(user) });
}
