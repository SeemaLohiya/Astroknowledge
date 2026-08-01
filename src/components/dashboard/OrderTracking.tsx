"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { isBookingItemType } from "@/lib/booking-order-status";
import { CartItemType, Order } from "@/lib/types";
import { Package } from "lucide-react";

const PRODUCT_STATUS_ORDER: Order["status"][] = ["pending", "processing", "shipped", "delivered"];
const BOOKING_STATUS_ORDER: Order["status"][] = ["pending", "processing", "delivered"];

export function OrderTracking({ order, itemType = "product" }: { order: Order; itemType?: CartItemType }) {
  const { c } = useLanguage();
  const d = c.dashboard;
  const isBooking = isBookingItemType(itemType);
  const statusOrder = isBooking ? BOOKING_STATUS_ORDER : PRODUCT_STATUS_ORDER;
  const currentIdx = statusOrder.indexOf(
    order.status === "shipped" && isBooking ? "processing" : order.status
  );

  const labels: Record<Order["status"], string> = isBooking
    ? itemType === "healing"
      ? {
          pending: d.healingOrderPurchased,
          processing: d.healingOrderConnect,
          shipped: d.healingOrderConnect,
          delivered: d.healingOrderCompleted,
          cancelled: d.orderCancelled,
        }
      : {
          pending: d.poojaOrderPurchased,
          processing: d.poojaOrderConnect,
          shipped: d.poojaOrderConnect,
          delivered: d.poojaOrderCompleted,
          cancelled: d.orderCancelled,
        }
    : {
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
      <div className="flex gap-1">
        {statusOrder.map((status, i) => (
          <div key={status} className="flex-1">
            <div className={`h-1.5 rounded-full ${i <= currentIdx ? "bg-gold" : "bg-gold/15"}`} />
            <p
              className={`mt-1 text-[9px] leading-tight ${i <= currentIdx ? "font-medium text-gold" : "text-text-muted"}`}
            >
              {labels[status]}
            </p>
          </div>
        ))}
      </div>
      {order.trackingHistory && order.trackingHistory.length > 0 && (
        <div className="mt-3 space-y-1 border-t border-gold/10 pt-2">
          {order.trackingHistory
            .slice()
            .reverse()
            .slice(0, 3)
            .map((ev, i) => (
              <p key={i} className="flex items-start gap-1 text-[10px] text-text-muted">
                <Package className="mt-0.5 h-3 w-3 shrink-0 text-gold" />
                <span>
                  {ev.note || labels[ev.status]} — {new Date(ev.at).toLocaleDateString("en-IN")}
                </span>
              </p>
            ))}
        </div>
      )}
    </div>
  );
}
