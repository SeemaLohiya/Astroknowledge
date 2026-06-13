import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { User } from "./types";

function getSecret() {
  const env = process.env.JWT_SECRET?.trim();
  return new TextEncoder().encode(env && env.length >= 16 ? env : "astroknowledge-secret-key-2026");
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export const AUTH_COOKIE = "auth-token";
export const AUTH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function createToken(user: User): Promise<string> {
  return new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: AUTH_MAX_AGE,
    path: "/",
  };
}

export function sanitizeUser(user: User & { _id?: unknown; __v?: unknown }) {
  const { password: _pw, _id, __v, ...safe } = user;
  void _pw;
  void _id;
  void __v;
  return safe;
}
