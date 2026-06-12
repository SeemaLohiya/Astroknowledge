"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { ItemNextStep } from "@/components/dashboard/ItemNextStep";
import { OrderTracking } from "@/components/dashboard/OrderTracking";
import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { fetchJson } from "@/lib/fetch-json";
import { getDisplayStatus, getStatusStyle } from "@/lib/purchase-display";
import { CartItemType, Order, OrderStatus, UserPurchase } from "@/lib/types";
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

type FilterTab = "all" | CartItemType;

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

export default function PurchasesPage() {
  const { lang, c } = useLanguage();
  const d = c.dashboard;
  const p = c.purchases;
  const [purchases, setPurchases] = useState<UserPurchase[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState<"all" | OrderStatus>("all");

  const TYPE_META = useMemo(() => ({
    product: { label: c.cart.itemTypes.product, icon: Package, color: "bg-purple-500/15 text-purple-700" },
    service: { label: c.cart.itemTypes.service, icon: Sparkles, color: "bg-gold/20 text-gold" },
    course: { label: c.cart.itemTypes.course, icon: BookOpen, color: "bg-blue-500/15 text-blue-700" },
    pooja: { label: c.cart.itemTypes.pooja, icon: ShoppingBag, color: "bg-rose-500/15 text-rose-700" },
    healing: { label: c.cart.itemTypes.healing, icon: Sparkles, color: "bg-emerald-500/15 text-emerald-700" },
  }), [c]);

  const loadOrders = () => {
    void fetchJson<{ purchases?: UserPurchase[]; orders?: Order[] }>("/api/orders", { cache: "no-store" }).then((res) => {
      setPurchases(res.data?.purchases || []);
      setOrders(res.data?.orders || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadOrders();
    const onFocus = () => loadOrders();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const resolveOrder = (purchase: UserPurchase) =>
    purchase.orderId ? orders.find((o) => o.id === purchase.orderId) ?? null : null;

  const flatItems = useMemo(() => {
    const list: FlatItem[] = [];
    purchases.forEach((purchase) => {
      purchase.items.forEach((item) => {
        list.push({
          key: `${purchase.id}-${item.itemType}-${item.id}`,
          purchase,
          item,
        });
      });
    });
    return list.sort((a, b) => b.purchase.createdAt.localeCompare(a.purchase.createdAt));
  }, [purchases]);

  const filtered = useMemo(() => {
    let list = flatItems;
    if (tab !== "all") list = list.filter((f) => f.item.itemType === tab);
    if (orderStatusFilter !== "all") {
      list = list.filter((f) => {
        const order = f.purchase.orderId ? orders.find((o) => o.id === f.purchase.orderId) : null;
        return order?.status === orderStatusFilter;
      });
    }
    return list;
  }, [flatItems, tab, orderStatusFilter, orders]);

  const counts = useMemo(() => {
    const cnt: Record<FilterTab, number> = { all: flatItems.length, product: 0, service: 0, course: 0, pooja: 0, healing: 0 };
    flatItems.forEach((f) => { cnt[f.item.itemType]++; });
    return cnt;
  }, [flatItems]);

  return (
    <PageTransition>
      <FadeIn>
        <h1 className="font-display text-2xl font-bold text-text-primary mb-2">
          {d.purchasesTitle} <span className="text-gradient-gold">{d.purchasesTitleAccent}</span>
        </h1>
        <p className="text-sm text-text-muted mb-6">{p.subtitleFull}</p>
      </FadeIn>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "service", "product", "course", "pooja", "healing"] as FilterTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              tab === t ? "bg-gold text-white" : "glass-card text-text-body hover:text-gold"
            }`}
          >
            {t === "all" ? c.all : TYPE_META[t].label}
            {counts[t] > 0 && <span className="ml-1 opacity-80">({counts[t]})</span>}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-xs text-text-muted">{d.orderStatusFilter}:</span>
        {(["all", "processing", "shipped", "delivered", "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setOrderStatusFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
              orderStatusFilter === s ? "bg-gold/20 text-gold border border-gold/40" : "glass-card text-text-body hover:text-gold"
            }`}
          >
            {s === "all" ? c.all : s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-text-muted py-12">{c.common.loading}</p>
      ) : filtered.length === 0 ? (
        <FadeIn>
          <div className="rounded-2xl glass-card p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-text-muted mb-4" />
            <p className="text-text-body">{d.noPurchases}</p>
            <Button href="/services" variant="secondary" className="mt-4">{d.exploreServices}</Button>
          </div>
        </FadeIn>
      ) : (
        <div className="space-y-4">
          {filtered.map(({ key, purchase, item }, i) => {
            const meta = TYPE_META[item.itemType];
            const linkedOrder = resolveOrder(purchase);
            const orderStatus = linkedOrder?.status ?? purchase.orderStatus;
            const displayStatus = getDisplayStatus(purchase.paymentStatus, orderStatus, item.itemType, lang);
            const TypeIcon = meta.icon;

            return (
              <FadeIn key={key} delay={i * 0.03}>
                <motion.div className="rounded-2xl glass-card overflow-hidden" layout>
                  <div className="flex flex-wrap items-start gap-4 p-5">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${meta.color}`}>
                          <TypeIcon className="h-3 w-3" /> {meta.label}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${getStatusStyle(purchase.paymentStatus, orderStatus, item.itemType)}`}>
                          {displayStatus}
                        </span>
                        {purchase.method && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
                            {purchase.method === "razorpay" ? <CreditCard className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                            {purchase.method === "razorpay" ? p.razorpay : p.adminApproval}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-text-primary">{item.name}</h3>
                      <p className="text-xs text-text-muted mt-0.5">
                        {p.qty} {item.quantity} · {formatDate(purchase.createdAt)}
                        {purchase.orderId && ` · ${p.order} #${purchase.orderId}`}
                        {purchase.paymentStatus === "awaiting_approval" && purchase.transactionRefId && (
                          <> · {p.ref} <span className="text-text-primary">{purchase.transactionRefId}</span></>
                        )}
                      </p>
                      <p className="mt-1 flex items-center font-bold text-gold text-sm">
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
                  <div className="border-t border-gold/10 px-5 py-4 bg-orange/[0.03]">
                    <ItemNextStep
                      itemType={item.itemType}
                      itemId={item.id}
                      paymentStatus={purchase.paymentStatus}
                      paymentId={purchase.paymentId}
                    />
                    {linkedOrder && item.itemType === "product" && (
                      <OrderTracking order={linkedOrder} />
                    )}
                  </div>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      )}
    </PageTransition>
  );
}
