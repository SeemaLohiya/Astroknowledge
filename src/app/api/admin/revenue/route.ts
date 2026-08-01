import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { adminRevenueStore } from "@/lib/admin-revenue-store";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await adminRevenueStore.get();
  return NextResponse.json({ revenue: data });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const saved = await adminRevenueStore.save({
    overrides: body.overrides || {},
    extraRows: body.extraRows || [],
    summaryNote: body.summaryNote,
  });
  return NextResponse.json({ revenue: saved });
}
