"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { parseResponseJson } from "@/lib/fetch-json";
import { UnifiedBookingItem } from "@/lib/types";
import { Calendar, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function statusStyle(status: UnifiedBookingItem["status"]) {
  switch (status) {
    case "pending":
      return "bg-yellow-500/20 text-yellow-800 border-yellow-500/30";
    case "confirmed":
      return "bg-green-500/20 text-green-700 border-green-500/30";
    case "completed":
      return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    case "cancelled":
      return "bg-red-500/20 text-red-600 border-red-500/30";
    default:
      return "bg-gold/10 text-gold border-gold/20";
  }
}

function statusLabel(status: UnifiedBookingItem["status"], d: ReturnType<typeof useLanguage>["c"]["dashboard"]) {
  switch (status) {
    case "pending":
      return d.bookingPending;
    case "confirmed":
      return d.bookingConfirmed;
    case "completed":
      return d.bookingCompleted;
    case "cancelled":
      return d.bookingCancelled;
    default:
      return status;
  }
}

export function UnifiedBookingsList({
  bookings,
  onChanged,
}: {
  bookings: UnifiedBookingItem[];
  onChanged?: () => void;
}) {
  const { c } = useLanguage();
  const d = c.dashboard;
  const [cancelling, setCancelling] = useState<string | null>(null);

  const handleCancel = async (booking: UnifiedBookingItem) => {
    if (booking.source !== "slot") {
      toast.error("Only calendar slots can be cancelled here.");
      return;
    }
    setCancelling(booking.id);
    try {
      const res = await fetch(`/api/slots/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      const data = await parseResponseJson<{ message?: string; error?: string }>(res);
      if (!res.ok || !data) throw new Error(data?.error || d.failedCancel);
      toast.success(data.message || d.slotCancelled);
      onChanged?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : d.failedCancel);
    } finally {
      setCancelling(null);
    }
  };

  if (bookings.length === 0) {
    return <p className="text-sm text-text-muted">{d.noBookings}</p>;
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <div
          key={`${booking.source}-${booking.id}`}
          className="rounded-xl border border-gold/15 bg-gradient-to-r from-orange/5 to-transparent px-4 py-4 flex flex-wrap items-start justify-between gap-3 transition-all hover:border-gold/30 hover:shadow-sm"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-text-primary">{booking.serviceName}</p>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusStyle(booking.status)}`}>
                {statusLabel(booking.status, d)}
              </span>
            </div>
            <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wide">
              {booking.source === "slot" ? d.slotBooking : d.requestBooking}
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-text-body">
              <span className="flex items-center gap-1.5 rounded-lg bg-white/60 px-2 py-1">
                <Calendar className="h-3.5 w-3.5 text-gold" />
                {booking.date}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-white/60 px-2 py-1">
                <Clock className="h-3.5 w-3.5 text-gold" />
                {booking.time}
              </span>
            </div>
            {booking.status === "pending" && (
              <p className="mt-2 text-xs text-gold">
                Online consultation awaiting admin confirmation — you will be notified once confirmed.
              </p>
            )}
            {booking.status === "confirmed" && (
              <p className="mt-2 flex items-center gap-1 text-xs text-green-700">
                <MessageCircle className="h-3 w-3" /> Your online consultation is confirmed. Check WhatsApp for reminders.
              </p>
            )}
          </div>
          {booking.source === "slot" && (booking.status === "pending" || booking.status === "confirmed") && (
            <button
              type="button"
              disabled={cancelling === booking.id}
              onClick={() => handleCancel(booking)}
              className="rounded-full border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              {cancelling === booking.id ? "..." : d.cancelSlot}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
