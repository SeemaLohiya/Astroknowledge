"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { fetchJson } from "@/lib/fetch-json";
import {
  BOOKING_ORDER_STATUSES,
  bookingStatusLabel,
  bookingStatusNote,
  isBookingItemType,
} from "@/lib/booking-order-status";
import { CartItemType, Order, OrderStatus } from "@/lib/types";
import { motion } from "framer-motion";
import { IndianRupee, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const PRODUCT_STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const ITEM_TYPE_PREFIXES: CartItemType[] = ["product", "service", "course", "pooja", "healing"];

const TITLES: Record<CartItemType, string> = {
  product: "Products orders",
  service: "Consultancy Services orders",
  pooja: "Pooja orders",
  healing: "Healing orders",
  course: "Courses orders",
};

function resolveItemType(item: Order["items"][number]): CartItemType | null {
  if (item.itemType) return item.itemType;
  const prefix = ITEM_TYPE_PREFIXES.find((t) => item.productId.startsWith(`${t}-`));
  return prefix || null;
}

function statusesForType(itemType?: CartItemType): OrderStatus[] {
  return isBookingItemType(itemType) ? BOOKING_ORDER_STATUSES : PRODUCT_STATUSES;
}

function statusLabel(status: OrderStatus, itemType?: CartItemType): string {
  if (isBookingItemType(itemType)) return bookingStatusLabel(status, itemType);
  return status;
}

function statusBadgeClass(status: OrderStatus, itemType?: CartItemType): string {
  if (isBookingItemType(itemType)) {
    if (status === "delivered") return "bg-green-500/20 text-green-700";
    if (status === "processing" || status === "shipped") return "bg-blue-500/20 text-blue-700";
    if (status === "cancelled") return "bg-red-500/20 text-red-600";
    return "bg-gold/20 text-gold";
  }
  if (status === "delivered") return "bg-green-500/20 text-green-700";
  if (status === "shipped") return "bg-blue-500/20 text-blue-700";
  if (status === "processing") return "bg-gold/20 text-gold";
  if (status === "cancelled") return "bg-red-500/20 text-red-600";
  return "bg-yellow-500/20 text-yellow-700";
}

export function AdminOrdersPanel({ itemType }: { itemType?: CartItemType }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [search, setSearch] = useState("");

  const statuses = statusesForType(itemType);

  const load = () =>
    fetchJson<{ orders?: Order[] }>("/api/orders", { cache: "no-store" }).then((d) =>
      setOrders(d.data?.orders || [])
    );
  useEffect(() => {
    load();
  }, []);

  const typedOrders = useMemo(() => {
    if (!itemType) return orders;
    return orders.filter((o) => o.items.some((i) => resolveItemType(i) === itemType));
  }, [orders, itemType]);

  const filtered = useMemo(() => {
    let list = [...typedOrders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (statusFilter !== "all") list = list.filter((o) => o.status === statusFilter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.userName.toLowerCase().includes(q) ||
          o.items.some((i) => i.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [typedOrders, statusFilter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: typedOrders.length };
    statuses.forEach((s) => {
      c[s] = typedOrders.filter((o) => o.status === s).length;
    });
    return c;
  }, [typedOrders, statuses]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    const note = isBookingItemType(itemType)
      ? bookingStatusNote(status, itemType)
      : `Status updated to ${statusLabel(status, itemType)}`;

    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note, itemType }),
    });
    if (!res.ok) {
      toast.error("Failed to update order");
      return;
    }
    toast.success(
      isBookingItemType(itemType)
        ? `${itemType === "pooja" ? "Pooja" : "Healing"} status updated — user will see it on their dashboard`
        : "Order status updated — visible to user on next refresh"
    );
    load();
  };

  const title = itemType ? TITLES[itemType] : "Orders";

  return (
    <PageTransition>
      <FadeIn>
        <h1 className="font-display text-2xl font-bold text-text-primary mb-2">
          Manage <span className="text-gradient-gold">{title}</span>
        </h1>
        <p className="text-sm text-text-muted mb-6">
          {itemType === "pooja"
            ? "Update pooja progress: Purchased → Team will connect → Pooja completed"
            : itemType === "healing"
              ? "Update healing progress: Purchased → Team will connect → Healing completed"
              : "Status changes sync to the user's My Purchases dashboard"}
          {itemType && !isBookingItemType(itemType) ? ` · filtered to ${itemType} items` : ""}
        </p>
      </FadeIn>

      <FadeIn className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, customer, product..."
            className="w-full rounded-xl border border-gold/20 bg-orange/5 pl-9 pr-3 py-2.5 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | OrderStatus)}
          className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2.5 text-sm min-w-[180px]"
        >
          <option value="all">All statuses ({counts.all})</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s, itemType)} ({counts[s] || 0})
            </option>
          ))}
        </select>
      </FadeIn>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusFilter === "all" ? "bg-gold text-white" : "glass-card"}`}
        >
          All ({counts.all})
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusFilter === s ? "bg-gold text-white" : "glass-card"}`}
          >
            {statusLabel(s, itemType)} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-text-muted py-12">No orders match your filters</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((o, i) => (
            <FadeIn key={o.id} delay={i * 0.03}>
              <motion.div className="rounded-2xl glass-card p-5" whileHover={{ x: 2 }}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-text-primary">#{o.id}</p>
                    <p className="text-sm text-text-muted">
                      {o.userName} — {o.createdAt}
                    </p>
                    {o.items
                      .filter((item) => !itemType || resolveItemType(item) === itemType)
                      .map((item) => (
                        <p key={item.productId} className="text-xs text-text-muted">
                          {item.name} x{item.quantity}
                          {resolveItemType(item) && (
                            <span className="ml-1 capitalize text-gold/80">({resolveItemType(item)})</span>
                          )}
                        </p>
                      ))}
                    <p className="mt-1 flex items-center font-bold text-gold">
                      <IndianRupee className="h-4 w-4" />
                      {o.total.toLocaleString("en-IN")}
                    </p>
                    {o.trackingHistory && o.trackingHistory.length > 0 && (
                      <p className="mt-2 text-[10px] text-text-muted">
                        Last update: {o.trackingHistory[o.trackingHistory.length - 1].note} —{" "}
                        {new Date(o.trackingHistory[o.trackingHistory.length - 1].at).toLocaleDateString("en-IN")}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass(o.status, itemType)}`}
                    >
                      {statusLabel(o.status, itemType)}
                    </span>
                    <select
                      value={o.status}
                      onChange={(e) => {
                        const next = e.target.value as OrderStatus;
                        void updateStatus(o.id, next);
                      }}
                      className="rounded-lg border border-gold/30 bg-cream px-3 py-2 text-sm text-text-primary"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {statusLabel(s, itemType)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
