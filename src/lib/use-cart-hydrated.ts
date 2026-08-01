"use client";

import { useProfile } from "@/components/profile/ProfileGate";
import { useCartStore } from "./cart-store";
import { useEffect, useState } from "react";

/** True after auth is ready and zustand cart has rehydrated for the correct user */
export function useCartHydrated() {
  const { authReady } = useProfile();
  const [hydrated, setHydrated] = useState(
    () => typeof window !== "undefined" && useCartStore.persist.hasHydrated()
  );

  useEffect(() => {
    if (!authReady) {
      setHydrated(false);
      return;
    }
    if (useCartStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useCartStore.persist.onFinishHydration(() => setHydrated(true));
  }, [authReady]);

  return authReady && hydrated;
}
