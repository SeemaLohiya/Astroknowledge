"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Order } from "@/lib/types";
import { Package, Truck } from "lucide-react";

const STATUS_ORDER: Order["status"][] = ["pending", "processing", "shipped", "delivered"];

export function OrderTracking({ order }: { order: Order }) {
  const { c } = useLanguage();
  const d = c.dashboard;
  const currentIdx = STATUS_ORDER.indexOf(order.status);

  const labels: Record<Order["status"], string> = {
    pending: d.orderPending,
    processing: d.orderProcessing,
    shipped: d.orderShipped,
    delivered: d.orderDelivered,
    cancelled: d.orderCancelled,
  };

  if (order.status === "cancelled") {
    return <p className="text-xs text-red-600">{d.orderCancelled}</p>;
  }

  return (
    <div className="mt-3 rounded-xl border border-gold/15 bg-white/60 p-3">
      {order.trackingId && (
        <p className="text-xs text-text-muted mb-2 flex items-center gap-1">
          <Truck className="h-3.5 w-3.5 text-gold" />
          {d.trackingId}: <span className="font-medium text-text-primary">{order.trackingId}</span>
        </p>
      )}
      <div className="flex gap-1">
        {STATUS_ORDER.map((status, i) => (
          <div key={status} className="flex-1">
            <div className={`h-1.5 rounded-full ${i <= currentIdx ? "bg-gold" : "bg-gold/15"}`} />
            <p className={`mt-1 text-[9px] leading-tight ${i <= currentIdx ? "text-gold font-medium" : "text-text-muted"}`}>
              {labels[status]}
            </p>
          </div>
        ))}
      </div>
      {order.trackingHistory && order.trackingHistory.length > 0 && (
        <div className="mt-3 space-y-1 border-t border-gold/10 pt-2">
          {order.trackingHistory.slice().reverse().slice(0, 3).map((ev, i) => (
            <p key={i} className="text-[10px] text-text-muted flex items-start gap-1">
              <Package className="h-3 w-3 text-gold shrink-0 mt-0.5" />
              <span>{ev.note || labels[ev.status]} — {new Date(ev.at).toLocaleDateString("en-IN")}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
