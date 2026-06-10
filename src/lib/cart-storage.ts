import type { StateStorage } from "zustand/middleware";
import { cartStorageKey } from "./cart-user";

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
  const guestKey = cartStorageKey();
  if (!localStorage.getItem(guestKey)) {
    localStorage.setItem(guestKey, legacy);
  }
  localStorage.removeItem("astroknowledge-cart");
}
