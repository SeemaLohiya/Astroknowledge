import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { paymentsStore } from "@/lib/payments-store";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = req.nextUrl.searchParams.get("status");
  const type = req.nextUrl.searchParams.get("type");
  const search = req.nextUrl.searchParams.get("search")?.toLowerCase() || "";
  const method = req.nextUrl.searchParams.get("method");

  let payments = paymentsStore.getAll();

  if (status && status !== "all") payments = payments.filter((p) => p.status === status);
  if (type && type !== "all") payments = payments.filter((p) => p.type === type);
  if (method && method !== "all") payments = payments.filter((p) => p.method === method);
  if (search) {
    payments = payments.filter((p) =>
      p.userName.toLowerCase().includes(search) ||
      p.userEmail.toLowerCase().includes(search) ||
      p.userPhone?.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.referenceId.toLowerCase().includes(search) ||
      p.transactionRefId?.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({ payments });
}
