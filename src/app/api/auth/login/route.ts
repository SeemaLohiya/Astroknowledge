import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, authCookieOptions, createToken, sanitizeUser } from "@/lib/auth";
import { readJsonBody } from "@/lib/security/api-guard";
import { store } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await readJsonBody<{ email?: string; password?: string }>(req);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email, password } = body;
  const user = await store.users.findByEmail(email?.trim().toLowerCase() ?? "");

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  if (user.accountStatus === "suspended") {
    return NextResponse.json({ error: "Your account has been suspended. Please contact support." }, { status: 403 });
  }

  const token = await createToken(user);
  const response = NextResponse.json({ user: sanitizeUser(user) });
  response.cookies.set(AUTH_COOKIE, token, authCookieOptions());
  return response;
}
