import { NextResponse } from "next/server";
import { AUTH_COOKIE, authCookieOptions, createToken, getSession, sanitizeUser } from "@/lib/auth";
import { store } from "@/lib/store";

/** Re-issue session cookie for active users (keeps admin logged in). */
export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const user = await store.users.findById(session.userId);
  if (!user || user.accountStatus === "suspended") {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const token = await createToken(user);
  const response = NextResponse.json({ user: sanitizeUser(user) });
  response.cookies.set(AUTH_COOKIE, token, authCookieOptions());
  return response;
}
