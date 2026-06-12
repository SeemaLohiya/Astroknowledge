import { NextResponse } from "next/server";
import { connectDB, isMongoEnabled } from "@/lib/db/connect";
import { connectRedis, isRedisEnabled } from "@/lib/db/redis-connect";
import { getPersistBackend } from "@/lib/db/persist";

export const dynamic = "force-dynamic";

export async function GET() {
  const backend = getPersistBackend();
  if (backend === "file") {
    return NextResponse.json({ status: "json-fallback", backend: "file", mongo: false, redis: false });
  }

  try {
    if (isMongoEnabled()) await connectDB();
    if (isRedisEnabled()) await connectRedis();
    return NextResponse.json({ status: "connected", backend, mongo: isMongoEnabled(), redis: isRedisEnabled() });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        backend,
        mongo: isMongoEnabled(),
        redis: isRedisEnabled(),
        error: e instanceof Error ? e.message : "Connection failed",
      },
      { status: 503 }
    );
  }
}
