import { NextRequest, NextResponse } from "next/server";
import { authCookieOptions, createToken, sanitizeUser } from "@/lib/auth";
import { store } from "@/lib/store";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = await store.users.findByEmail(email?.trim().toLowerCase() ?? "");

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  if (user.accountStatus === "suspended") {
    return NextResponse.json({ error: "Your account has been suspended. Please contact support." }, { status: 403 });
  }

  const token = await createToken(user);
  const response = NextResponse.json({ user: sanitizeUser(user) });
  response.cookies.set("auth-token", token, authCookieOptions());
  return response;
}
