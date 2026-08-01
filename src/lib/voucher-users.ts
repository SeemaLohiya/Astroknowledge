import { Voucher } from "./types";

/** Sentinel in assignedUserIds meaning the voucher applies to every user. */
export const VOUCHER_ALL_USERS = "*";

export function isVoucherForAllUsers(voucher: Voucher): boolean {
  return voucher.assignedUserIds.includes(VOUCHER_ALL_USERS);
}

export function isVoucherAssignedToUser(voucher: Voucher, userId: string): boolean {
  return isVoucherForAllUsers(voucher) || voucher.assignedUserIds.includes(userId);
}

export function formatVoucherAssignees(
  assignedUserIds: string[],
  users: { id: string; name: string }[]
): string {
  if (assignedUserIds.includes(VOUCHER_ALL_USERS)) return "All users";
  if (!assignedUserIds.length) return "No users assigned";
  return assignedUserIds.map((id) => users.find((u) => u.id === id)?.name || id).join(", ");
}
