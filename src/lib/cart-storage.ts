import type { StateStorage } from "zustand/middleware";
import { CartItem } from "./types";
import { cartStorageKey } from "./cart-user";

function itemKey(item: { id: string; itemType: string }) {
  return `${item.itemType}:${item.id}`;
}

function storageKeyForUser(userId: string | null) {
  return `astroknowledge-cart-${userId || "guest"}`;
}

/** Read persisted cart items for a specific user/guest without changing active storage key */
export function readPersistedCartItems(userId: string | null): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKeyForUser(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { state?: { items?: CartItem[] } };
    return (parsed.state?.items || []).filter((i) => i?.id && i?.name && i.quantity > 0);
  } catch {
    return [];
  }
}

export function mergeCartItems(...lists: CartItem[][]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const list of lists) {
    for (const item of list) {
      const key = itemKey(item);
      const existing = map.get(key);
      if (existing) {
        map.set(key, { ...existing, quantity: existing.quantity + item.quantity });
      } else {
        map.set(key, { ...item });
      }
    }
  }
  return Array.from(map.values());
}

/** Per-user localStorage so new logins don't inherit another user's cart */
export const cartStateStorage: StateStorage = {
  getItem: (_name) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(cartStorageKey());
  },
  setItem: (_name, value) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(cartStorageKey(), value);
  },
  removeItem: (_name) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(cartStorageKey());
  },
};

/** One-time migration from shared cart key to per-user keys */
export function migrateLegacyCartStorage() {
  if (typeof window === "undefined") return;
  const legacy = localStorage.getItem("astroknowledge-cart");
  if (!legacy) return;
  const guestKey = storageKeyForUser(null);
  if (!localStorage.getItem(guestKey)) {
    localStorage.setItem(guestKey, legacy);
  }
  localStorage.removeItem("astroknowledge-cart");
}
