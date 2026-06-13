"use client";

import { useProfile } from "@/components/profile/ProfileGate";
import { useCartStore } from "@/lib/cart-store";
import { setCartUserId } from "@/lib/cart-user";
import { useEffect, useRef } from "react";

/** Rehydrate cart when logged-in user changes — prevents stale items from another account */
export function CartUserSync() {
  const { user, authReady } = useProfile();
  const prevId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (!authReady) return;
    const nextId = user?.id || "guest";
    if (prevId.current === nextId) return;
    prevId.current = nextId;
    setCartUserId(user?.id || null);
    useCartStore.setState({ items: [] });
    void useCartStore.persist.rehydrate();
  }, [user?.id, authReady]);

  return null;
}
