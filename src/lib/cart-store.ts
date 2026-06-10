"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { cartStateStorage } from "./cart-storage";
import { CartItem, CartItemType } from "./types";

export function cartKey(item: { id: string; itemType: CartItemType }) {
  return `${item.itemType}:${item.id}`;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
}

function normalizeItems(items: unknown[]): CartItem[] {
  return (items as Record<string, unknown>[])
    .map((i) => {
      if (i.itemType && i.id) return i as unknown as CartItem;
      return {
        id: (i.productId as string) || (i.id as string),
        itemType: (i.itemType as CartItemType) || "product",
        name: i.name as string,
        price: i.price as number,
        quantity: (i.quantity as number) || 1,
        image: i.image as string,
      };
    })
    .filter((i) => i.id && i.name && Number.isFinite(i.price) && i.quantity > 0);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const key = cartKey(item);
        const existing = get().items.find((i) => cartKey(i) === key);
        if (existing) {
          set({
            items: get().items.map((i) =>
              cartKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
      },
      removeItem: (key) => set({ items: get().items.filter((i) => cartKey(i) !== key) }),
      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          get().removeItem(key);
          return;
        }
        set({
          items: get().items.map((i) => (cartKey(i) === key ? { ...i, quantity } : i)),
        });
      },
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "astroknowledge-cart",
      storage: createJSONStorage(() => cartStateStorage),
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
      merge: (persisted, current) => ({
        ...current,
        items: normalizeItems((persisted as CartStore)?.items || []),
      }),
    }
  )
);
