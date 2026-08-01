import { NextRequest, NextResponse } from "next/server";
import {
  SECURITY_HEADERS,
  checkFirewall,
  developmentCsp,
  productionCsp,
} from "@/lib/security/firewall";

function applySecurityHeaders(res: NextResponse, isProd: boolean) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }
  res.headers.set("Content-Security-Policy", isProd ? productionCsp() : developmentCsp());
  if (isProd) {
    res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  return res;
}

export function middleware(req: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  const verdict = checkFirewall(req);

  if (!verdict.allowed) {
    const blocked = NextResponse.json({ error: verdict.message }, { status: verdict.status });
    blocked.headers.set("X-Firewall", "blocked");
    return applySecurityHeaders(blocked, isProd);
  }

  const res = NextResponse.next();
  res.headers.set("X-Firewall", "pass");
  return applySecurityHeaders(res, isProd);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml|webmanifest)$).*)",
  ],
};
