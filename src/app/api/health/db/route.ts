import { NextResponse } from "next/server";
import { connectDB, isMongoEnabled } from "@/lib/db/connect";
import { getPersistBackend } from "@/lib/db/persist";

export const dynamic = "force-dynamic";

export async function GET() {
  const backend = getPersistBackend();
  if (backend === "file") {
    return NextResponse.json({
      status: "json-fallback",
      backend: "file",
      mongo: false,
      message: "Set MONGODB_URI for production persistence",
    });
  }

  try {
    await connectDB();
    return NextResponse.json({ status: "connected", backend: "mongo", mongo: true });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        backend: "mongo",
        mongo: isMongoEnabled(),
        error: e instanceof Error ? e.message : "Connection failed",
      },
      { status: 503 }
    );
  }
}
