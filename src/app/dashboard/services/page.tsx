"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { PurchaseHistoryList } from "@/components/dashboard/PurchaseHistoryList";
import { UnifiedBookingsList } from "@/components/dashboard/UnifiedBookingsList";
import { Button } from "@/components/ui/Button";
import { fetchJson } from "@/lib/fetch-json";
import { UnifiedBookingItem } from "@/lib/types";
import { Calendar, Clock } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function DashboardServicesPage() {
  const [bookings, setBookings] = useState<UnifiedBookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    void fetchJson<{ bookings?: UnifiedBookingItem[] }>("/api/bookings/unified", { cache: "no-store" }).then(
      (res) => {
        const list = (res.data?.bookings || []).filter((b) => b.source === "slot");
        setBookings(list);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <PageTransition>
      <PurchaseHistoryList
        itemType="service"
        title="Consultancy"
        titleAccent="Services"
        subtitle="Your purchased consultancy services, booking requests, and consultation slots"
        emptyLabel="No consultancy service purchases yet"
      />

      <FadeIn className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-text-primary">Book Consultation</h2>
            <p className="text-sm text-text-muted">Schedule an online slot for a paid consultancy service</p>
          </div>
          <Button href="/dashboard/slots" variant="secondary" size="sm">
            <Clock className="h-4 w-4" /> Open calendar
          </Button>
        </div>
      </FadeIn>

      <FadeIn className="mt-8">
        <h2 className="mb-1 flex items-center gap-2 font-display text-xl font-bold text-text-primary">
          <Calendar className="h-5 w-5 text-gold" /> My Booking Requests
        </h2>
        <p className="mb-4 text-sm text-text-muted">Pending and confirmed consultation bookings</p>
        <div className="rounded-2xl glass-card p-5">
          {loading ? (
            <p className="text-sm text-text-muted">Loading…</p>
          ) : (
            <UnifiedBookingsList bookings={bookings} onChanged={load} />
          )}
        </div>
      </FadeIn>
    </PageTransition>
  );
}
