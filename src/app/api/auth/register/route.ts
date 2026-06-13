import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, authCookieOptions, createToken, sanitizeUser } from "@/lib/auth";
import { store } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, dob, birthTime, birthPlace, dobUnknown, birthTimeUnknown, birthPlaceUnknown } =
      await req.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (await store.users.findByEmail(normalizedEmail)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hasBirth =
      dob || birthTime || birthPlace || dobUnknown || birthTimeUnknown || birthPlaceUnknown;

    const user = await store.users.create({
      name: name.trim(),
      email: normalizedEmail,
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
    response.cookies.set(AUTH_COOKIE, token, authCookieOptions());
    return response;
  } catch (err) {
    console.error("Register failed:", err);
    if (err instanceof Error && err.message === "DUPLICATE_EMAIL") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not create account. Please try again." }, { status: 500 });
  }
}
