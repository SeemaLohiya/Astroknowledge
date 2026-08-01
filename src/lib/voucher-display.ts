import { VoucherDiscountType } from "./types";

export function formatVoucherDiscount(
  discountType: VoucherDiscountType,
  discountValue: number,
  options?: { suffix?: string; locale?: boolean }
): string {
  const suffix = options?.suffix ? ` ${options.suffix}` : "";
  if (discountType === "percent") return `${discountValue}%${suffix}`;
  const amount = options?.locale !== false ? discountValue.toLocaleString("en-IN") : String(discountValue);
  return `₹${amount}${suffix}`;
}
