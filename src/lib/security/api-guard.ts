import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { checkFirewall } from "@/lib/security/firewall";

type RouteHandler = (req: NextRequest, context?: unknown) => Promise<NextResponse> | NextResponse;

/** Extra API-route guard — use on sensitive handlers when needed */
export function withFirewall(handler: RouteHandler): RouteHandler {
  return async (req, context) => {
    const verdict = checkFirewall(req);
    if (!verdict.allowed) {
      return NextResponse.json({ error: verdict.message }, { status: verdict.status });
    }
    return handler(req, context);
  };
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

const MAX_JSON_BYTES = 512_000;

/** Reject oversized JSON bodies on write endpoints */
export async function readJsonBody<T = unknown>(req: NextRequest): Promise<T | null> {
  const length = Number(req.headers.get("content-length") || 0);
  if (length > MAX_JSON_BYTES) return null;
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}
