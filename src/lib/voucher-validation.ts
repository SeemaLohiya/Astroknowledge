import { CartItem, Voucher } from "./types";
import { vouchersStore } from "./vouchers-store";

export interface VoucherApplyResult {
  voucher: Voucher;
  subtotal: number;
  discountAmount: number;
  total: number;
}

function isWithinDateRange(voucher: Voucher, now = new Date()) {
  const from = new Date(voucher.validFrom);
  const until = new Date(voucher.validUntil);
  until.setHours(23, 59, 59, 999);
  return now >= from && now <= until;
}

export async function validateVoucherForUser(
  code: string,
  userId: string,
  items: CartItem[],
  subtotal: number
): Promise<VoucherApplyResult> {
  const voucher = await vouchersStore.getByCode(code);
  if (!voucher) throw new Error("Invalid voucher code");
  if (!voucher.active) throw new Error("This voucher is no longer active");
  if (!voucher.assignedUserIds.includes(userId)) {
    throw new Error("This voucher is not assigned to your account");
  }
  if (!isWithinDateRange(voucher)) throw new Error("This voucher has expired or is not yet valid");
  if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
    throw new Error("This voucher has reached its usage limit");
  }
  if (voucher.minOrderAmount && subtotal < voucher.minOrderAmount) {
    throw new Error(`Minimum order amount is ₹${voucher.minOrderAmount}`);
  }

  const eligible = items.filter((item) => {
    if (voucher.applicableItemTypes?.length && !voucher.applicableItemTypes.includes(item.itemType)) {
      return false;
    }
    if (voucher.applicableItemIds?.length && !voucher.applicableItemIds.includes(item.id)) {
      return false;
    }
    return true;
  });

  if (voucher.applicableItemTypes?.length || voucher.applicableItemIds?.length) {
    if (!eligible.length) throw new Error("Voucher does not apply to items in your cart");
  }

  const eligibleSubtotal = eligible.reduce((s, i) => s + i.price * i.quantity, 0);
  let discount =
    voucher.discountType === "percent"
      ? Math.round((eligibleSubtotal * voucher.discountValue) / 100)
      : voucher.discountValue;

  if (voucher.maxDiscount) discount = Math.min(discount, voucher.maxDiscount);
  discount = Math.min(discount, subtotal);
  if (discount <= 0) throw new Error("Voucher provides no discount for this order");

  return {
    voucher,
    subtotal,
    discountAmount: discount,
    total: Math.max(0, subtotal - discount),
  };
}
