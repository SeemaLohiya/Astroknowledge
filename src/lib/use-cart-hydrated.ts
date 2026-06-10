"use client";

import { useCartStore } from "./cart-store";
import { useEffect, useState } from "react";

/** True after zustand cart has rehydrated from localStorage (rehydrate runs once in AppProviders) */
export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(
    () => typeof window !== "undefined" && useCartStore.persist.hasHydrated()
  );

  useEffect(() => {
    if (useCartStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useCartStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
