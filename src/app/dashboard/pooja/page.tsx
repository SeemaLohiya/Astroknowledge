"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { PurchaseHistoryList } from "@/components/dashboard/PurchaseHistoryList";
import { SavedAddresses } from "@/components/dashboard/SavedAddresses";

export default function DashboardPoojaPage() {
  return (
    <PageTransition>
      <FadeIn className="mb-8">
        <SavedAddresses />
      </FadeIn>
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
