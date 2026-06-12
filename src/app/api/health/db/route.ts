import { NextResponse } from "next/server";
import { connectDB, isMongoEnabled } from "@/lib/db/connect";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isMongoEnabled()) {
    return NextResponse.json({ status: "json-fallback", mongo: false });
  }

  try {
    await connectDB();
    return NextResponse.json({ status: "connected", mongo: true });
  } catch (e) {
    return NextResponse.json(
      { status: "error", mongo: true, error: e instanceof Error ? e.message : "Connection failed" },
      { status: 503 }
    );
  }
}
