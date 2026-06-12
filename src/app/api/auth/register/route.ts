import { NextRequest, NextResponse } from "next/server";
import { authCookieOptions, createToken, sanitizeUser } from "@/lib/auth";
import { store } from "@/lib/store";

export async function POST(req: NextRequest) {
  const { name, email, phone, password, dob, birthTime, birthPlace, dobUnknown, birthTimeUnknown, birthPlaceUnknown } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (store.users.findByEmail(email)) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const hasBirth =
    dob || birthTime || birthPlace || dobUnknown || birthTimeUnknown || birthPlaceUnknown;

  const user = store.users.create({
    name,
    email,
    phone: phone || "",
    password,
    role: "user",
    dob: dob || undefined,
    birthTime: birthTime || undefined,
    birthPlace: birthPlace || undefined,
    dobUnknown: !!dobUnknown,
    birthTimeUnknown: !!birthTimeUnknown,
    birthPlaceUnknown: !!birthPlaceUnknown,
    birthDetailsUpdatedAt: hasBirth ? new Date().toISOString() : undefined,
  });

  const token = await createToken(user);
  const response = NextResponse.json({ user: sanitizeUser(user) });
  response.cookies.set("auth-token", token, authCookieOptions());
  return response;
}
