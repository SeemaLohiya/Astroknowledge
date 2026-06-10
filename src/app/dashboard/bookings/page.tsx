"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { UnifiedBookingsList } from "@/components/dashboard/UnifiedBookingsList";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { fetchJson } from "@/lib/fetch-json";
import { UnifiedBookingItem } from "@/lib/types";
import { Calendar, CheckCircle, Clock, Hourglass } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function DashboardBookingsPage() {
  const { c } = useLanguage();
  const d = c.dashboard;
  const [bookings, setBookings] = useState<UnifiedBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | UnifiedBookingItem["status"]>("all");

  useEffect(() => {
    void fetchJson<{ bookings?: UnifiedBookingItem[] }>("/api/bookings/unified").then((res) => {
      setBookings(res.data?.bookings || []);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  }), [bookings]);

  const filtered = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  return (
    <PageTransition>
      <FadeIn>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-7 w-7 text-gold" />
            <div>
              <h1 className="font-display text-2xl font-bold text-text-primary">{d.bookingsTitle}</h1>
              <p className="text-sm text-text-muted">{d.bookingsSubtitle}</p>
            </div>
          </div>
          <Button href="/dashboard/slots" variant="secondary" size="sm">{d.bookConsultation}</Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.05} className="mb-6 grid gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: stats.total, icon: Calendar },
          { label: "Pending", value: stats.pending, icon: Hourglass },
          { label: "Confirmed", value: stats.confirmed, icon: CheckCircle },
          { label: "Completed", value: stats.completed, icon: Clock },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gold/15 bg-orange/5 px-4 py-3 text-center">
            <s.icon className="mx-auto h-5 w-5 text-gold mb-1" />
            <p className="text-xl font-bold text-text-primary">{s.value}</p>
            <p className="text-xs text-text-muted">{s.label}</p>
          </div>
        ))}
      </FadeIn>

      <FadeIn delay={0.08} className="mb-4 flex flex-wrap gap-2">
        {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
              filter === f ? "bg-gold text-white" : "glass-card text-text-body hover:text-gold"
            }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="rounded-2xl glass-card p-6">
          {loading ? (
            <p className="text-sm text-text-muted">{c.common.loading}</p>
          ) : (
            <UnifiedBookingsList bookings={filtered} />
          )}
          {!loading && bookings.length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-gold/25 bg-orange/5 p-6 text-center">
              <p className="text-sm text-text-body mb-4">No bookings yet. Purchase a consultation service, then book your preferred slot.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button href="/services" variant="secondary" size="sm">{d.browseServices}</Button>
                <Button href="/dashboard/slots" variant="outline" size="sm">{d.bookConsultation}</Button>
              </div>
            </div>
          )}
          {!loading && filtered.length === 0 && bookings.length > 0 && (
            <p className="text-sm text-text-muted text-center py-4">No {filter} bookings</p>
          )}
        </div>
      </FadeIn>

      {!loading && bookings.length > 0 && (
        <FadeIn delay={0.15} className="mt-6">
          <Link href="/dashboard/slots" className="text-sm text-gold hover:underline">
            Need another slot? Book consultation →
          </Link>
        </FadeIn>
      )}
    </PageTransition>
  );
}
