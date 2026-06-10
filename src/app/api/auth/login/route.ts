import { NextRequest, NextResponse } from "next/server";
import { createToken, sanitizeUser } from "@/lib/auth";
import { store } from "@/lib/store";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = store.users.findByEmail(email);

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = await createToken(user);
  const response = NextResponse.json({ user: sanitizeUser(user) });
  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
