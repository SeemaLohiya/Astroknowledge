import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { validateCartItems } from "@/lib/cart-validation";
import { validateVoucherForUser } from "@/lib/voucher-validation";
import { vouchersStore } from "@/lib/vouchers-store";
import { getPaidServices, hasPaidServiceAccess } from "@/lib/purchases";
import { paymentsStore } from "@/lib/payments-store";
import { CartItem } from "@/lib/types";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please login to continue" }, { status: 401 });

  const body = await req.json();
  const { userName, userPhone, userEmail, items, total, voucherCode } = body as {
    userName: string;
    userPhone: string;
    userEmail?: string;
    items: CartItem[];
    total: number;
    voucherCode?: string;
  };

  if (!userName?.trim() || !userPhone?.trim() || !items?.length) {
    return NextResponse.json({ error: "Name, phone, and items are required" }, { status: 400 });
  }

  let validatedItems: CartItem[];
  let serverTotal: number;
  try {
    const validated = await validateCartItems(items);
    validatedItems = validated.items;
    serverTotal = validated.total;
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid cart items" },
      { status: 400 }
    );
  }

  let finalTotal = serverTotal;
  let discountAmount = 0;
  let voucherId: string | undefined;

  if (voucherCode?.trim()) {
    try {
      const applied = await validateVoucherForUser(voucherCode, session.userId, validatedItems, serverTotal);
      finalTotal = applied.total;
      discountAmount = applied.discountAmount;
      voucherId = applied.voucher.id;
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Invalid voucher" },
        { status: 400 }
      );
    }
  }

  if (typeof total === "number" && Math.abs(total - finalTotal) > 1) {
    return NextResponse.json({ error: "Cart total mismatch — please refresh and try again" }, { status: 400 });
  }

  const payment = await paymentsStore.createCheckout({
    userId: session.userId,
    userName: userName.trim(),
    userEmail: userEmail?.trim() || session.email,
    userPhone: userPhone.trim(),
    items: validatedItems,
    total: finalTotal,
    subtotal: serverTotal,
    discountAmount: discountAmount || undefined,
    voucherCode: voucherCode?.trim().toUpperCase(),
    voucherId,
  });

  if (voucherId) await vouchersStore.incrementUsage(voucherId);

  return NextResponse.json({ payment }, { status: 201 });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ hasPaidAccess: false });

  return NextResponse.json({
    hasPaidAccess: await paymentsStore.hasPaidAccess(session.userId),
    hasPaidServiceAccess: await hasPaidServiceAccess(session.userId),
    paidServices: await getPaidServices(session.userId),
  });
}
