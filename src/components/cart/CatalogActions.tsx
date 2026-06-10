"use client";

import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { formatMsg } from "@/lib/i18n/ui-strings";
import { useIsAdmin } from "@/lib/use-is-admin";
import { useCartStore } from "@/lib/cart-store";
import { CartItemType } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { EmptyCartModal } from "./EmptyCartModal";

interface CatalogActionsProps {
  id: string;
  itemType: CartItemType;
  name: string;
  price: number;
  image: string;
  bookHref?: string;
  bookLabel?: string;
  addLabel?: string;
  className?: string;
  fullWidth?: boolean;
  hideBookButton?: boolean;
}

export function CatalogActions({
  id,
  itemType,
  name,
  price,
  image,
  bookHref = "/checkout",
  bookLabel,
  addLabel,
  className = "",
  fullWidth = true,
  hideBookButton = false,
}: CatalogActionsProps) {
  const { c } = useLanguage();
  const isAdmin = useIsAdmin();
  const addItem = useCartStore((s) => s.addItem);
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const router = useRouter();
  const [showEmpty, setShowEmpty] = useState(false);
  const resolvedAddLabel = addLabel ?? c.cart.addToCart;
  const resolvedBookLabel = bookLabel ?? c.cart.proceedToCheckout;

  if (isAdmin) return null;

  const handleAdd = () => {
    addItem({ id, itemType, name, price, image });
    toast.success(formatMsg(c.cart.addedToast, { name }));
  };

  const handleBook = () => {
    if (count === 0) {
      addItem({ id, itemType, name, price, image });
      toast.success(formatMsg(c.cart.addedToast, { name }));
    }
    router.push(bookHref);
  };

  const w = fullWidth ? "w-full" : "";

  return (
    <>
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <button
          type="button"
          onClick={handleAdd}
          className={`flex items-center justify-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-4 py-2.5 text-sm font-semibold text-gold hover:bg-gold/20 transition-colors ${w}`}
        >
          <ShoppingCart className="h-4 w-4" /> {resolvedAddLabel}
        </button>
        {!hideBookButton && (
          <Button variant="primary" className={w} onClick={handleBook}>
            {resolvedBookLabel}
          </Button>
        )}
      </div>
      <EmptyCartModal open={showEmpty} onClose={() => setShowEmpty(false)} />
    </>
  );
}

export function AddToCartButton({
  id,
  itemType,
  name,
  price,
  image,
  className = "",
}: Omit<CatalogActionsProps, "bookHref" | "bookLabel" | "fullWidth">) {
  const { c } = useLanguage();
  const isAdmin = useIsAdmin();
  const addItem = useCartStore((s) => s.addItem);

  if (isAdmin) return null;

  return (
    <button
      type="button"
      onClick={() => {
        addItem({ id, itemType, name, price, image });
        toast.success(formatMsg(c.cart.addedToast, { name }));
      }}
      className={`flex items-center gap-1 rounded-full bg-gold/20 px-3 py-1.5 text-xs text-gold hover:bg-gold/30 ${className}`}
    >
      <ShoppingCart className="h-3 w-3" /> {c.sections.add}
    </button>
  );
}
