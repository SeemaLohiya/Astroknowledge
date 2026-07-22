"use client";

import { PageTransition } from "@/components/animations/PageTransition";
import { PurchaseHistoryList } from "@/components/dashboard/PurchaseHistoryList";

export default function DashboardPoojaPage() {
  return (
    <PageTransition>
      <PurchaseHistoryList
        itemType="pooja"
        title="My"
        titleAccent="Pooja"
        subtitle="Purchase history — our team will connect with you soon after payment"
        emptyLabel="No pooja purchases yet"
      />
    </PageTransition>
  );
}
