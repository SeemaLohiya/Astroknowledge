"use client";

import { CartUserSync } from "@/components/cart/CartUserSync";
import { ProfileGate } from "@/components/profile/ProfileGate";
import { migrateLegacyCartStorage } from "@/lib/cart-storage";
import { prefetchCatalogSnapshot } from "@/lib/catalog-cache";
import { useCartStore } from "@/lib/cart-store";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { scheduleIdle } from "@/lib/schedule-idle";
import { prefetchEditableContent } from "@/lib/use-editable-content";
import { useEffect } from "react";

function ClientStores() {
  useEffect(() => {
    migrateLegacyCartStorage();
    void useCartStore.persist.rehydrate();
  }, []);
  return null;
}

function WarmCaches() {
  useEffect(() => {
    return scheduleIdle(() => {
      void prefetchCatalogSnapshot();
      void prefetchEditableContent();
    });
  }, []);
  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ClientStores />
      <WarmCaches />
      <ProfileGate>
        <CartUserSync />
        {children}
      </ProfileGate>
    </LanguageProvider>
  );
}
