"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { UnifiedBookingItem } from "@/lib/types";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { Calendar, Clock } from "lucide-react";

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
}: {
  bookings: UnifiedBookingItem[];
  onChanged?: () => void;
}) {
  const { c } = useLanguage();
  const d = c.dashboard;

  if (bookings.length === 0) {
    return <p className="text-sm text-text-muted">{d.noBookings}</p>;
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <div
          key={`${booking.source}-${booking.id}`}
          className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-gold/15 bg-gradient-to-r from-orange/5 to-transparent px-4 py-4 transition-all hover:border-gold/30 hover:shadow-sm"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-text-primary">{booking.serviceName}</p>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusStyle(booking.status)}`}
              >
                {statusLabel(booking.status, d)}
              </span>
            </div>
            <p className="mt-1 text-[10px] uppercase tracking-wide text-text-muted">{d.slotBooking}</p>
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
                <WhatsAppIcon className="h-3 w-3" /> Your online consultation is confirmed. Check WhatsApp for
                reminders.
              </p>
            )}
            {(booking.status === "pending" || booking.status === "confirmed") && (
              <p className="mt-2 text-xs text-text-muted">
                Slot is locked until the consultation is completed by the admin.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
