"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { EmptyCartModal } from "@/components/cart/EmptyCartModal";
import { useProfile } from "@/components/profile/ProfileGate";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cartKey, useCartStore } from "@/lib/cart-store";
import { useCartHydrated } from "@/lib/use-cart-hydrated";
import { parseResponseJson } from "@/lib/fetch-json";
import { CartItem } from "@/lib/types";
import { SafeImage } from "@/components/ui/SafeImage";
import { IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

async function proceedToPayment(
  form: { userName: string; userPhone: string; userEmail: string },
  items: CartItem[],
  total: number
) {
  if (form.userName.trim() && form.userPhone.trim()) {
    await fetch("/api/users/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.userName.trim(), phone: form.userPhone.trim() }),
    });
  }

  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userName: form.userName.trim(),
      userPhone: form.userPhone.trim(),
      userEmail: form.userEmail.trim(),
      items,
      total,
    }),
  });
  const data = await parseResponseJson<{ payment?: { id: string }; error?: string }>(res);
  if (!res.ok || !data?.payment?.id) throw new Error(data?.error || "Failed");
  return data.payment.id;
}

export default function CheckoutPage() {
  const { c } = useLanguage();
  const ch = c.checkout;
  const cartHydrated = useCartHydrated();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0));
  const router = useRouter();
  const { user, loading: profileLoading } = useProfile();
  const [loading, setLoading] = useState(false);
  const showEmpty = items.length === 0;
  const [form, setForm] = useState({ userName: "", userPhone: "", userEmail: "" });

  useEffect(() => {
    if (!profileLoading && !user) {
      router.replace("/login?redirect=/checkout");
    }
  }, [user, profileLoading, router]);

  const userDefaults = user
    ? { userName: user.name || "", userEmail: user.email || "", userPhone: user.phone || "" }
    : null;
  const resolvedForm = userDefaults
    ? {
        userName: form.userName || userDefaults.userName,
        userEmail: form.userEmail || userDefaults.userEmail,
        userPhone: form.userPhone || userDefaults.userPhone,
      }
    : form;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(ch.loginRequired);
      router.push("/login?redirect=/checkout");
      return;
    }
    if (!resolvedForm.userName.trim() || !resolvedForm.userPhone.trim()) {
      toast.error(ch.namePhoneRequired);
      return;
    }

    setLoading(true);
    try {
      const paymentId = await proceedToPayment(resolvedForm, items, total);
      router.push(`/payment?id=${paymentId}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : ch.checkoutFailed);
    } finally {
      setLoading(false);
    }
  };

  if (!cartHydrated) {
    return <PageTransition><p className="py-20 text-center text-text-muted">{c.common.loading}</p></PageTransition>;
  }

  if (items.length === 0) {
    return (
      <PageTransition>
        <EmptyCartModal open={showEmpty} onClose={() => router.push("/")} />
      </PageTransition>
    );
  }

  if (profileLoading || !user) {
    return <PageTransition><p className="py-20 text-center text-text-muted">{c.common.loading}</p></PageTransition>;
  }

  return (
    <PageTransition>
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <FadeIn>
            <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
              {ch.title} <span className="text-gradient-gold">{ch.titleAccent}</span>
            </h1>
            <p className="text-text-body text-sm mb-8">{ch.subtitleLoggedIn}</p>
          </FadeIn>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FadeIn className="rounded-2xl glass-card p-6 space-y-4">
              <h2 className="font-semibold text-text-primary">{ch.yourAccount}</h2>
              <div>
                <label className="block text-xs text-text-muted mb-1">{ch.fullName} *</label>
                <input required value={resolvedForm.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} className="w-full rounded-xl border border-gold/20 bg-orange/5 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">{ch.phone} *</label>
                <input required type="tel" value={resolvedForm.userPhone} onChange={(e) => setForm({ ...form, userPhone: e.target.value })} className="w-full rounded-xl border border-gold/20 bg-orange/5 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">{ch.email} *</label>
                <input required type="email" value={resolvedForm.userEmail} disabled className="w-full rounded-xl border border-gold/20 bg-orange/5 px-4 py-3 text-sm disabled:opacity-60" />
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="rounded-2xl glass-card p-6">
              <h2 className="font-semibold text-text-primary mb-4">{ch.orderTitle} ({items.length})</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={cartKey(item)} className="flex items-center gap-3 rounded-xl bg-orange/5 p-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                      <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-text-primary truncate">{item.name}</p>
                      <p className="text-[10px] text-gold">{(c.cart.itemTypes as Record<string, string>)[item.itemType]} × {item.quantity}</p>
                    </div>
                    <span className="flex items-center font-bold text-gold text-sm">
                      <IndianRupee className="h-3.5 w-3.5" />{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between border-t border-gold/15 pt-4 text-lg font-bold">
                <span className="text-text-primary">{c.cart.total}</span>
                <span className="flex items-center text-gold"><IndianRupee className="h-5 w-5" />{total.toLocaleString("en-IN")}</span>
              </div>
            </FadeIn>

            <Button type="submit" variant="secondary" size="lg" className="w-full" disabled={loading}>
              {loading ? c.pleaseWait : c.cart.continueToPayment}
            </Button>
          </form>
        </div>
      </section>
    </PageTransition>
  );
}
