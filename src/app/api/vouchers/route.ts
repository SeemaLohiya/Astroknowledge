import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAvailableVouchersForUser } from "@/lib/voucher-availability";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ vouchers: [] });

  const vouchers = await getAvailableVouchersForUser(session.userId);
  return NextResponse.json({ vouchers });
}
