import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { validateCartItems } from "@/lib/cart-validation";
import { validateVoucherForUser } from "@/lib/voucher-validation";
import { getPaidServices, hasPaidServiceAccess } from "@/lib/purchases";
import { paymentsStore } from "@/lib/payments-store";
import { CartItem } from "@/lib/types";
import { addressesStore } from "@/lib/addresses-store";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please login to continue" }, { status: 401 });

  const body = await req.json();
  const { userName, userPhone, userEmail, items, total, voucherCode, shippingAddressId } = body as {
    userName: string;
    userPhone: string;
    userEmail?: string;
    items: CartItem[];
    total: number;
    voucherCode?: string;
    shippingAddressId?: string;
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

  const needsAddress = validatedItems.some((i) => i.itemType === "product" || i.itemType === "pooja");
  let shippingAddress: string | undefined;
  if (needsAddress) {
    if (!shippingAddressId?.trim()) {
      return NextResponse.json(
        { error: "Delivery address is required for products and pooja" },
        { status: 400 }
      );
    }
    const addresses = await addressesStore.getByUser(session.userId);
    const addr = addresses.find((a) => a.id === shippingAddressId);
    if (!addr) {
      return NextResponse.json({ error: "Selected delivery address not found" }, { status: 400 });
    }
    shippingAddress = [
      addr.name,
      addr.phone,
      addr.line1,
      addr.line2,
      `${addr.city}, ${addr.state}, ${addr.country} ${addr.pincode}`,
      addr.locationLink ? `Location: ${addr.locationLink}` : "",
    ]
      .filter(Boolean)
      .join(" · ");
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
    shippingAddress,
  });

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
