"use client";

import { PageTransition } from "@/components/animations/PageTransition";
import { PurchaseHistoryList } from "@/components/dashboard/PurchaseHistoryList";

export default function DashboardProductsPage() {
  return (
    <PageTransition>
      <PurchaseHistoryList
        itemType="product"
        title="My"
        titleAccent="Products"
        subtitle="Purchase history, product information, and delivery tracking"
        emptyLabel="No product purchases yet"
      />
    </PageTransition>
  );
}
