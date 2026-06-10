import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { User } from "./types";

const SECRET = new TextEncoder().encode("astroknowledge-secret-key-2026");

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export async function createToken(user: User): Promise<string> {
  return new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function sanitizeUser(user: User) {
  const { password: _pw, ...safe } = user;
  void _pw;
  return safe;
}
