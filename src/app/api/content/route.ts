import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { contentStore } from "@/lib/content-store";

export const revalidate = 60;

export async function GET() {
  return NextResponse.json(
    { content: await contentStore.get() },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const content = await contentStore.update(body);
  return NextResponse.json({ content });
}
