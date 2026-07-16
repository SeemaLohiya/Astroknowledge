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
  itemType: "service" | "course";
}

/** Paid services and courses that unlock online slot booking (no physical delivery). */
export async function getPaidServices(userId: string): Promise<PaidServiceItem[]> {
  const seen = new Set<string>();
  const items: PaidServiceItem[] = [];

  for (const purchase of await getUserPurchases(userId)) {
    if (purchase.paymentStatus !== "paid") continue;
    for (const item of purchase.items ?? []) {
      if ((item.itemType !== "service" && item.itemType !== "course") || seen.has(item.id)) continue;
      seen.add(item.id);
      items.push({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        itemType: item.itemType,
      });
    }
  }

  return items;
}

export async function hasPaidServiceAccess(userId: string): Promise<boolean> {
  const services = await getPaidServices(userId);
  return services.length > 0;
}

/** Purchases from real checkout payments only — no orphan seed orders */
export async function getUserPurchases(userId: string): Promise<UserPurchase[]> {
  const payments = await paymentsStore.getByUser(userId);
  return payments
    .filter((p) => p.type === "checkout")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(paymentToPurchase);
}
