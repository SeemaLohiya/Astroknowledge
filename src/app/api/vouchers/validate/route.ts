import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { validateCartItems } from "@/lib/cart-validation";
import { validateVoucherForUser } from "@/lib/voucher-validation";
import { CartItem } from "@/lib/types";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please login" }, { status: 401 });

  const { code, items } = (await req.json()) as { code: string; items: CartItem[] };
  if (!code?.trim() || !items?.length) {
    return NextResponse.json({ error: "Code and cart items required" }, { status: 400 });
  }

  try {
    const { items: validated, total: subtotal } = await validateCartItems(items);
    const result = await validateVoucherForUser(code, session.userId, validated, subtotal);
    return NextResponse.json({
      valid: true,
      code: result.voucher.code,
      label: result.voucher.label,
      discountAmount: result.discountAmount,
      subtotal: result.subtotal,
      total: result.total,
    });
  } catch (e) {
    return NextResponse.json(
      { valid: false, error: e instanceof Error ? e.message : "Invalid voucher" },
      { status: 400 }
    );
  }
}
