import { CartItemType, Voucher, VoucherDiscountType } from "./types";
import { VOUCHER_ALL_USERS } from "./voucher-users";

export type VoucherWriteInput = {
  code: string;
  label: string;
  description?: string;
  discountType: VoucherDiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  assignedUserIds: string[];
  applicableItemTypes?: CartItemType[];
  applicableItemIds?: string[];
  usageLimit?: number | null;
  active: boolean;
};

export function normalizeVoucherInput(raw: Record<string, unknown>): VoucherWriteInput {
  const usageLimitRaw = raw.usageLimit;
  const assigned = Array.isArray(raw.assignedUserIds)
    ? raw.assignedUserIds.map(String).filter(Boolean)
    : [];

  return {
    code: String(raw.code || "").trim().toUpperCase(),
    label: String(raw.label || "").trim(),
    description: raw.description ? String(raw.description) : undefined,
    discountType: raw.discountType === "fixed" ? "fixed" : "percent",
    discountValue: Math.max(0, Number(raw.discountValue) || 0),
    minOrderAmount: Math.max(0, Number(raw.minOrderAmount) || 0),
    maxDiscount:
      raw.maxDiscount === undefined || raw.maxDiscount === null || raw.maxDiscount === ""
        ? undefined
        : Math.max(0, Number(raw.maxDiscount) || 0),
    validFrom: String(raw.validFrom || ""),
    validUntil: String(raw.validUntil || ""),
    assignedUserIds: assigned.includes(VOUCHER_ALL_USERS) ? [VOUCHER_ALL_USERS] : assigned,
    applicableItemTypes: Array.isArray(raw.applicableItemTypes)
      ? (raw.applicableItemTypes as CartItemType[])
      : [],
    applicableItemIds: Array.isArray(raw.applicableItemIds) ? raw.applicableItemIds.map(String) : [],
    usageLimit:
      usageLimitRaw === null || usageLimitRaw === undefined || usageLimitRaw === ""
        ? null
        : Math.max(1, Number(usageLimitRaw) || 1),
    active: raw.active !== false,
  };
}

export function validateVoucherInput(input: VoucherWriteInput): string | null {
  if (!input.code) return "Code is required";
  if (!input.label) return "Label is required";
  if (!input.validFrom || !input.validUntil) return "Valid dates are required";
  if (!input.assignedUserIds.length) return "Assign at least one user or select All users";
  if (input.discountType === "percent" && input.discountValue > 100) {
    return "Percentage discount cannot exceed 100%";
  }
  return null;
}

export function stripVoucherDoc<T extends Record<string, unknown>>(doc: T): Omit<T, "_id" | "__v"> {
  const { _id, __v, ...rest } = doc;
  return rest;
}
