"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { PurchaseHistoryList } from "@/components/dashboard/PurchaseHistoryList";
import { SavedAddresses } from "@/components/dashboard/SavedAddresses";

export default function DashboardProductsPage() {
  return (
    <PageTransition>
      <FadeIn className="mb-8">
        <SavedAddresses />
      </FadeIn>
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
