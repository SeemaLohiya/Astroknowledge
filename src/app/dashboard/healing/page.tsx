"use client";

import { PageTransition } from "@/components/animations/PageTransition";
import { PurchaseHistoryList } from "@/components/dashboard/PurchaseHistoryList";

export default function DashboardHealingPage() {
  return (
    <PageTransition>
      <PurchaseHistoryList
        itemType="healing"
        title="My"
        titleAccent="Healing"
        subtitle="Purchase history — our team will connect with you soon after payment"
        emptyLabel="No healing purchases yet"
      />
    </PageTransition>
  );
}
