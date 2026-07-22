"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { ItemNextStep } from "@/components/dashboard/ItemNextStep";
import { OrderTracking } from "@/components/dashboard/OrderTracking";
import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { fetchJson } from "@/lib/fetch-json";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDisplayStatus, getStatusStyle } from "@/lib/purchase-display";
import { CartItemType, Order, UserPurchase } from "@/lib/types";
import { motion } from "framer-motion";
import {
  BookOpen,
  CreditCard,
  IndianRupee,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface FlatItem {
  key: string;
  purchase: UserPurchase;
  item: UserPurchase["items"][number];
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

const EXPLORE: Record<CartItemType, string> = {
  product: "/products",
  service: "/services",
  course: "/courses",
  pooja: "/pooja",
  healing: "/healing",
};

interface PurchaseHistoryListProps {
  itemType: CartItemType;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  emptyLabel?: string;
  /** Extra content under each paid item (e.g. course resources) */
  renderExtra?: (ctx: { item: UserPurchase["items"][number]; purchase: UserPurchase }) => React.ReactNode;
  hideNextStep?: boolean;
}

export function PurchaseHistoryList({
  itemType,
  title,
  titleAccent,
  subtitle,
  emptyLabel,
  renderExtra,
  hideNextStep,
}: PurchaseHistoryListProps) {
  const { lang, c } = useLanguage();
  const d = c.dashboard;
  const p = c.purchases;
  const [purchases, setPurchases] = useState<UserPurchase[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const TYPE_META = useMemo(
    () => ({
      product: { label: c.cart.itemTypes.product, icon: Package, color: "bg-purple-500/15 text-purple-700" },
      service: { label: "Consultancy Services", icon: Sparkles, color: "bg-gold/20 text-gold" },
      course: { label: c.cart.itemTypes.course, icon: BookOpen, color: "bg-blue-500/15 text-blue-700" },
      pooja: { label: c.cart.itemTypes.pooja, icon: ShoppingBag, color: "bg-rose-500/15 text-rose-700" },
      healing: { label: c.cart.itemTypes.healing, icon: Sparkles, color: "bg-emerald-500/15 text-emerald-700" },
    }),
    [c]
  );

  useEffect(() => {
    const load = () => {
      void fetchJson<{ purchases?: UserPurchase[]; orders?: Order[] }>("/api/orders", { cache: "no-store" }).then(
        (res) => {
          setPurchases(res.data?.purchases || []);
          setOrders(res.data?.orders || []);
          setLoading(false);
        }
      );
    };
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  const filtered = useMemo(() => {
    const list: FlatItem[] = [];
    purchases.forEach((purchase) => {
      purchase.items.forEach((item) => {
        if (item.itemType !== itemType) return;
        list.push({
          key: `${purchase.id}-${item.itemType}-${item.id}`,
          purchase,
          item,
        });
      });
    });
    return list.sort((a, b) => b.purchase.createdAt.localeCompare(a.purchase.createdAt));
  }, [purchases, itemType]);

  const meta = TYPE_META[itemType];
  const TypeIcon = meta.icon;

  return (
    <div>
      <FadeIn>
        <h1 className="mb-2 font-display text-2xl font-bold text-text-primary">
          {title} {titleAccent ? <span className="text-gradient-gold">{titleAccent}</span> : null}
        </h1>
        {subtitle ? <p className="mb-6 text-sm text-text-muted">{subtitle}</p> : <div className="mb-6" />}
      </FadeIn>

      {loading ? (
        <p className="py-12 text-center text-text-muted">{c.common.loading}</p>
      ) : filtered.length === 0 ? (
        <FadeIn>
          <div className="rounded-2xl glass-card p-12 text-center">
            <TypeIcon className="mx-auto mb-4 h-12 w-12 text-text-muted" />
            <p className="text-text-body">{emptyLabel || d.noPurchases}</p>
            <Button href={EXPLORE[itemType]} variant="secondary" className="mt-4">
              Explore
            </Button>
          </div>
        </FadeIn>
      ) : (
        <div className="space-y-4">
          {filtered.map(({ key, purchase, item }, i) => {
            const linkedOrder = purchase.orderId ? orders.find((o) => o.id === purchase.orderId) ?? null : null;
            const orderStatus = linkedOrder?.status ?? purchase.orderStatus;
            const displayStatus = getDisplayStatus(purchase.paymentStatus, orderStatus, item.itemType, lang);

            return (
              <FadeIn key={key} delay={i * 0.03}>
                <motion.div className="overflow-hidden rounded-2xl glass-card" layout>
                  <div className="flex flex-wrap items-start gap-4 p-5">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${meta.color}`}
                        >
                          <TypeIcon className="h-3 w-3" /> {meta.label}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${getStatusStyle(purchase.paymentStatus, orderStatus, item.itemType)}`}
                        >
                          {displayStatus}
                        </span>
                        {purchase.method && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
                            {purchase.method === "razorpay" ? (
                              <CreditCard className="h-3 w-3" />
                            ) : (
                              <ShieldCheck className="h-3 w-3" />
                            )}
                            {purchase.method === "razorpay" ? p.razorpay : p.adminApproval}
                          </span>
                        )}
                      </div>
                      <h3 className="break-words font-semibold text-text-primary">{item.name}</h3>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {p.qty} {item.quantity} · {formatDate(purchase.createdAt)}
                        {purchase.orderId && ` · ${p.order} #${purchase.orderId}`}
                      </p>
                      <p className="mt-1 flex items-center text-sm font-bold text-gold">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                      {purchase.adminComment && (
                        <p className="mt-2 rounded-lg bg-gold/10 px-3 py-2 text-xs text-text-body">
                          <span className="font-semibold text-gold">Admin note:</span> {purchase.adminComment}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-gold/10 bg-orange/[0.03] px-5 py-4">
                    {!hideNextStep && (
                      <ItemNextStep
                        itemType={item.itemType}
                        itemId={item.id}
                        paymentStatus={purchase.paymentStatus}
                        paymentId={purchase.paymentId}
                      />
                    )}
                    {linkedOrder && item.itemType === "product" && <OrderTracking order={linkedOrder} />}
                    {renderExtra?.({ item, purchase })}
                  </div>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      )}
    </div>
  );
}
