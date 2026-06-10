import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { getUserPurchases } from "@/lib/purchases";
import { store } from "@/lib/store";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role === "admin") {
    return NextResponse.json({ orders: store.orders.getAll(), purchases: [] });
  }

  const purchases = getUserPurchases(session.userId);
  const orders = store.orders.getByUser(session.userId);

  return NextResponse.json({ orders, purchases });
}

export async function POST() {
  return NextResponse.json(
    { error: "Please use checkout — add items to cart and complete payment" },
    { status: 400 }
  );
}
