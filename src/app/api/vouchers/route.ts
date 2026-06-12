import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { vouchersStore } from "@/lib/vouchers-store";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ vouchers: [] });

  const now = new Date();
  const vouchers = (await vouchersStore.getForUser(session.userId)).filter((v) => {
    const until = new Date(v.validUntil);
    until.setHours(23, 59, 59, 999);
    return v.active && now <= until && now >= new Date(v.validFrom);
  });

  return NextResponse.json({ vouchers });
}
