import { paymentsStore } from "./payments-store";
import { PaymentRecord, UserPurchase } from "./types";

function paymentToPurchase(p: PaymentRecord): UserPurchase {
  return {
    id: p.id,
    paymentId: p.id,
    orderId: p.referenceId,
    paymentStatus: p.status,
    orderStatus: p.status === "paid" ? "processing" : undefined,
    method: p.method,
    transactionRefId: p.transactionRefId,
    paymentProofImage: p.paymentProofImage,
    adminComment: p.adminComment,
    items: p.items ?? [],
    total: p.amount,
    createdAt: p.createdAt,
  };
}

export interface PaidServiceItem {
  id: string;
  name: string;
  image: string;
  price: number;
}

export function getPaidServices(userId: string): PaidServiceItem[] {
  const seen = new Set<string>();
  const services: PaidServiceItem[] = [];

  for (const purchase of getUserPurchases(userId)) {
    if (purchase.paymentStatus !== "paid") continue;
    for (const item of purchase.items ?? []) {
      if (item.itemType !== "service" || seen.has(item.id)) continue;
      seen.add(item.id);
      services.push({ id: item.id, name: item.name, image: item.image, price: item.price });
    }
  }

  return services;
}

export function hasPaidServiceAccess(userId: string): boolean {
  return getPaidServices(userId).length > 0;
}

/** Purchases from real checkout payments only — no orphan seed orders */
export function getUserPurchases(userId: string): UserPurchase[] {
  return paymentsStore
    .getByUser(userId)
    .filter((p) => p.type === "checkout")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(paymentToPurchase);
}
