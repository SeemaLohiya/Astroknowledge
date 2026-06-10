"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { EmptyCartModal } from "@/components/cart/EmptyCartModal";
import { useProfile } from "@/components/profile/ProfileGate";
import { useIsAdmin } from "@/lib/use-is-admin";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cartKey, useCartStore } from "@/lib/cart-store";
import { useCartHydrated } from "@/lib/use-cart-hydrated";
import { motion } from "framer-motion";
import { BookOpen, IndianRupee, Minus, Package, Plus, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function CartPage() {
  const { c } = useLanguage();
  const cartHydrated = useCartHydrated();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartStore((s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0));
  const router = useRouter();
  const { user } = useProfile();
  const isAdmin = useIsAdmin();
  const [showExplore, setShowExplore] = useState(false);

  const exploreLinks = useMemo(() => [
    { href: "/services", label: c.offerings.services, icon: Sparkles },
    { href: "/products", label: c.offerings.products, icon: Package },
    { href: "/courses", label: c.offerings.courses, icon: BookOpen },
    { href: "/pooja", label: c.offerings.pooja, icon: ShoppingBag },
  ], [c]);

  useEffect(() => {
    if (isAdmin) router.replace("/admin");
  }, [isAdmin, router]);

  const goCheckout = () => {
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  };

  const itemTypeLabel = (type: string) => {
    const map = c.cart.itemTypes as Record<string, string>;
    return map[type] || type;
  };

  if (isAdmin) return null;

  if (!cartHydrated) {
    return (
      <PageTransition>
        <p className="py-20 text-center text-text-muted">{c.common.loading}</p>
      </PageTransition>
    );
  }

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 px-4">
          <ShoppingBag className="h-16 w-16 text-text-muted mb-4" />
          <h2 className="text-xl font-bold text-text-primary">{c.cart.emptyTitle}</h2>
          <p className="text-text-body text-sm mt-2 mb-6">{c.cart.emptySubtitle}</p>
          <div className="grid gap-3 sm:grid-cols-2 max-w-md w-full">
            {exploreLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-xl glass-card p-4 hover:border-gold/40 transition-colors">
                <link.icon className="h-5 w-5 text-gold" />
                <span className="font-medium text-text-primary">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <FadeIn>
            <h1 className="font-display text-3xl font-bold text-text-primary mb-8">
              {c.cart.title} <span className="text-gradient-gold">{c.cart.titleAccent}</span>
            </h1>
          </FadeIn>

          <div className="space-y-4">
            {items.map((item, i) => (
              <FadeIn key={cartKey(item)} delay={i * 0.05}>
                <motion.div className="flex items-center gap-4 rounded-2xl glass-card p-4" layout>
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                    <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary truncate">{item.name}</h3>
                    <p className="text-[10px] text-gold">{itemTypeLabel(item.itemType)}</p>
                    <p className="text-gold font-bold flex items-center mt-0.5">
                      <IndianRupee className="h-4 w-4" />{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(cartKey(item), item.quantity - 1)} className="rounded-full bg-orange/10 p-1 text-text-primary hover:bg-white/20"><Minus className="h-4 w-4" /></button>
                    <span className="w-8 text-center text-text-primary">{item.quantity}</span>
                    <button onClick={() => updateQuantity(cartKey(item), item.quantity + 1)} className="rounded-full bg-orange/10 p-1 text-text-primary hover:bg-white/20"><Plus className="h-4 w-4" /></button>
                  </div>
                  <button onClick={() => removeItem(cartKey(item))} className="text-red-400 hover:text-red-300"><Trash2 className="h-5 w-5" /></button>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-8 rounded-2xl glass-card p-6">
            <div className="flex items-center justify-between text-xl font-bold">
              <span className="text-text-primary">{c.cart.total}</span>
              <span className="flex items-center text-gold"><IndianRupee className="h-6 w-6" />{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={goCheckout} variant="secondary" size="lg" className="flex-1 min-w-[200px]">
                {c.cart.proceedToCheckout}
              </Button>
              <Button onClick={() => setShowExplore(true)} variant="outline">{c.cart.addMore}</Button>
            </div>
          </FadeIn>
        </div>
      </section>
      <EmptyCartModal open={showExplore} onClose={() => setShowExplore(false)} />
    </PageTransition>
  );
}
