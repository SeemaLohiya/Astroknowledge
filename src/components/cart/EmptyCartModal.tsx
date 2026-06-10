"use client";

import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Package, ShoppingBag, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useHydrated } from "@/lib/use-hydrated";
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

interface EmptyCartModalProps {
  open: boolean;
  onClose: () => void;
}

export function EmptyCartModal({ open, onClose }: EmptyCartModalProps) {
  const { c } = useLanguage();
  const hydrated = useHydrated();

  const exploreLinks = useMemo(() => [
    { href: "/services", label: c.offerings.services, icon: Sparkles, desc: c.cart.exploreDesc.services },
    { href: "/products", label: c.offerings.products, icon: Package, desc: c.cart.exploreDesc.products },
    { href: "/courses", label: c.offerings.courses, icon: BookOpen, desc: c.cart.exploreDesc.courses },
    { href: "/pooja", label: c.offerings.pooja, icon: ShoppingBag, desc: c.cart.exploreDesc.pooja },
  ], [c]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!hydrated || !open) return null;

  return createPortal(
    <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[250] flex min-h-[100dvh] items-center justify-center bg-black/50 p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="empty-cart-title"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-md rounded-2xl bg-cream p-6 shadow-2xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute right-4 top-4 text-text-muted hover:text-gold" aria-label={c.closeAria}>
              <X className="h-5 w-5" />
            </button>
            <h3 id="empty-cart-title" className="font-display text-xl font-bold text-text-primary pr-8 text-center sm:text-left">
              {c.cart.emptyTitle}
            </h3>
            <p className="mt-2 text-sm text-text-body text-center sm:text-left">
              {c.emptyCart.exploreHint}
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {exploreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl border border-gold/20 bg-white p-3 hover:border-gold/50 hover:bg-gold/5 transition-colors"
                >
                  <link.icon className="h-5 w-5 text-gold shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-text-primary">{link.label}</p>
                    <p className="text-[10px] text-text-muted">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Button href="/cart" variant="outline" className="mt-5 w-full" onClick={onClose}>
              {c.cart.viewCart}
            </Button>
          </motion.div>
        </motion.div>
    </AnimatePresence>,
    document.body
  );
}
