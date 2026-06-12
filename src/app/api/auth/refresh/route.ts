import { NextResponse } from "next/server";
import { authCookieOptions, createToken, getSession, sanitizeUser } from "@/lib/auth";
import { store } from "@/lib/store";

/** Re-issue session cookie for active users (keeps admin logged in). */
export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const user = store.users.findById(session.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });

  const token = await createToken(user);
  const response = NextResponse.json({ user: sanitizeUser(user) });
  response.cookies.set("auth-token", token, authCookieOptions());
  return response;
}
