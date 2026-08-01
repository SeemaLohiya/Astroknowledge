"use client";

import { useProfile } from "@/components/profile/ProfileGate";
import { mergeCartItems, readPersistedCartItems } from "@/lib/cart-storage";
import { useCartStore } from "@/lib/cart-store";
import { setCartUserId } from "@/lib/cart-user";
import { useEffect, useRef } from "react";

/** Rehydrate cart after auth is known; merge guest cart into user cart on login */
export function CartUserSync() {
  const { user, authReady } = useProfile();
  const prevId = useRef<string | null | undefined>(undefined);
  const syncing = useRef(false);

  useEffect(() => {
    if (!authReady || syncing.current) return;

    const nextId = user?.id || "guest";
    if (prevId.current === nextId) return;

    const previousId = prevId.current;
    prevId.current = nextId;
    syncing.current = true;

    const isLoginFromGuest = previousId === "guest" && nextId !== "guest";
    const carryOver = isLoginFromGuest
      ? mergeCartItems(useCartStore.getState().items, readPersistedCartItems(null))
      : [];

    setCartUserId(user?.id || null);

    void Promise.resolve(useCartStore.persist.rehydrate()).then(() => {
      const stored = useCartStore.getState().items;
      const merged = mergeCartItems(stored, carryOver);
      if (merged.length !== stored.length || JSON.stringify(merged) !== JSON.stringify(stored)) {
        useCartStore.setState({ items: merged });
      }
      syncing.current = false;
    });
  }, [user?.id, authReady]);

  return null;
}
