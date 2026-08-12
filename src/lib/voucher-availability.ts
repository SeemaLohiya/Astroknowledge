import { paymentsStore } from "./payments-store";
import { PaymentRecord, Voucher } from "./types";

const USED_STATUSES = new Set<PaymentRecord["status"]>(["paid", "awaiting_approval"]);

export function isVoucherExhausted(voucher: Voucher) {
  return Boolean(voucher.usageLimit && voucher.usedCount >= voucher.usageLimit);
}

export function isVoucherUsedByUser(voucher: Voucher, payments: PaymentRecord[]) {
  return payments.some(
    (p) =>
      USED_STATUSES.has(p.status) &&
      (p.voucherId === voucher.id || p.voucherCode?.toUpperCase() === voucher.code.toUpperCase())
  );
}

export function filterAvailableVouchersForUser(vouchers: Voucher[], payments: PaymentRecord[], now = new Date()) {
  return vouchers.filter((v) => {
    if (!v.active) return false;
    const from = new Date(v.validFrom);
    const until = new Date(v.validUntil);
    until.setHours(23, 59, 59, 999);
    if (now < from || now > until) return false;
    if (isVoucherExhausted(v)) return false;
    if (isVoucherUsedByUser(v, payments)) return false;
    return true;
  });
}

export async function getAvailableVouchersForUser(userId: string) {
  const { vouchersStore } = await import("./vouchers-store");
  const vouchers = await vouchersStore.getForUser(userId);
  const payments = await paymentsStore.getByUser(userId);
  return filterAvailableVouchersForUser(vouchers, payments);
}
