import type { NextRequest } from "next/server";

export type FirewallVerdict = { allowed: true } | { allowed: false; status: number; message: string };

/** Common scanner / exploit paths — block before they hit the app */
const BLOCKED_PATH_PATTERNS: RegExp[] = [
  /\.\./,
  /%2e%2e/i,
  /\/\.env/i,
  /\/\.git/i,
  /\/wp-admin/i,
  /\/wp-login/i,
  /\/wp-content/i,
  /\/xmlrpc\.php/i,
  /\/phpmyadmin/i,
  /\/phpinfo/i,
  /\/\.aws/i,
  /\/actuator/i,
  /\/cgi-bin/i,
  /\/shell/i,
  /\/admin\.php/i,
  /\/vendor\/phpunit/i,
  /\/config\.(json|ya?ml|php)/i,
  /\/backup/i,
  /\/sql/i,
  /\/\.htaccess/i,
];

/** Suspicious patterns in full URL (query included) */
const BLOCKED_URL_PATTERNS: RegExp[] = [
  /union\s+select/i,
  /sleep\s*\(/i,
  /benchmark\s*\(/i,
  /<script/i,
  /javascript:/i,
  /onerror\s*=/i,
  /onload\s*=/i,
  /base64_decode/i,
  /eval\s*\(/i,
  /\/etc\/passwd/i,
  /cmd\.exe/i,
];

const BLOCKED_METHODS = new Set(["TRACE", "TRACK", "CONNECT"]);

type RateBucket = { count: number; resetAt: number };

const globalStore = globalThis as typeof globalThis & {
  __akFirewallBuckets?: Map<string, RateBucket>;
};

function buckets() {
  if (!globalStore.__akFirewallBuckets) {
    globalStore.__akFirewallBuckets = new Map();
  }
  return globalStore.__akFirewallBuckets;
}

export function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

function rateLimit(key: string, limit: number, windowMs: number): FirewallVerdict {
  const now = Date.now();
  const map = buckets();
  const entry = map.get(key);

  if (!entry || now >= entry.resetAt) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= limit) {
    return { allowed: false, status: 429, message: "Too many requests. Please try again later." };
  }

  entry.count += 1;
  return { allowed: true };
}

/** Prune stale buckets occasionally */
function pruneBuckets() {
  const now = Date.now();
  const map = buckets();
  if (map.size < 5000) return;
  for (const [key, bucket] of map) {
    if (now >= bucket.resetAt) map.delete(key);
  }
}

function authRoute(pathname: string) {
  return pathname.startsWith("/api/auth/");
}

function uploadRoute(pathname: string) {
  return pathname.includes("/upload") || pathname.includes("/support/upload");
}

function adminApiRoute(pathname: string) {
  return pathname.startsWith("/api/admin/");
}

export function checkFirewall(req: NextRequest): FirewallVerdict {
  const { pathname } = req.nextUrl;
  const method = req.method.toUpperCase();

  if (BLOCKED_METHODS.has(method)) {
    return { allowed: false, status: 405, message: "Method not allowed" };
  }

  const rawUrl = req.nextUrl.href;
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      return { allowed: false, status: 403, message: "Forbidden" };
    }
  }
  for (const pattern of BLOCKED_URL_PATTERNS) {
    if (pattern.test(rawUrl)) {
      return { allowed: false, status: 403, message: "Forbidden" };
    }
  }

  // Block empty or absurdly long paths
  if (pathname.length > 512) {
    return { allowed: false, status: 414, message: "URI too long" };
  }

  const ip = clientIp(req);

  if (pathname.startsWith("/api/")) {
    pruneBuckets();

    if (authRoute(pathname)) {
      return rateLimit(`auth:${ip}`, 12, 60_000);
    }
    if (uploadRoute(pathname)) {
      return rateLimit(`upload:${ip}`, 25, 60_000);
    }
    if (adminApiRoute(pathname)) {
      return rateLimit(`admin-api:${ip}`, 80, 60_000);
    }
    return rateLimit(`api:${ip}`, 200, 60_000);
  }

  if (pathname.startsWith("/admin")) {
    return rateLimit(`admin-page:${ip}`, 120, 60_000);
  }

  return { allowed: true };
}

export const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-DNS-Prefetch-Control": "on",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(self)",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  "Cross-Origin-Resource-Policy": "same-site",
};

export function productionCsp() {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://lumberjack.razorpay.com",
    "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function developmentCsp() {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' data:",
    "connect-src 'self' https: http: ws: wss:",
    "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
  ].join("; ");
}
