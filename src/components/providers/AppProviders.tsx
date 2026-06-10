"use client";

import { CartUserSync } from "@/components/cart/CartUserSync";
import { ProfileGate } from "@/components/profile/ProfileGate";
import { migrateLegacyCartStorage } from "@/lib/cart-storage";
import { useCartStore } from "@/lib/cart-store";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { useEffect } from "react";

function ClientStores() {
  useEffect(() => {
    migrateLegacyCartStorage();
    void useCartStore.persist.rehydrate();
  }, []);
  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ClientStores />
      <ProfileGate>
        <CartUserSync />
        {children}
      </ProfileGate>
    </LanguageProvider>
  );
}
