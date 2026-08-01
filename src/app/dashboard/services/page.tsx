"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { PurchaseHistoryList } from "@/components/dashboard/PurchaseHistoryList";
import { SlotsBookingPanel } from "@/components/dashboard/SlotsBookingPanel";
import { UnifiedBookingsList } from "@/components/dashboard/UnifiedBookingsList";
import { fetchJson } from "@/lib/fetch-json";
import { cn } from "@/lib/cn";
import { UnifiedBookingItem } from "@/lib/types";
import { Calendar, Clock, ShoppingBag } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

type ServiceTab = "purchases" | "book" | "bookings";

const TABS: { id: ServiceTab; label: string; icon: typeof ShoppingBag }[] = [
  { id: "bookings", label: "My Bookings", icon: Clock },
  { id: "book", label: "Book Consultation", icon: Calendar },
  { id: "purchases", label: "My Purchases", icon: ShoppingBag },
];

function ServicesTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as ServiceTab) || "bookings";
  const [bookings, setBookings] = useState<UnifiedBookingItem[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const setTab = (next: ServiceTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", next);
    if (next !== "book") params.delete("service");
    router.replace(`/dashboard/services?${params.toString()}`);
  };

  const loadBookings = useCallback(() => {
    setLoadingBookings(true);
    void fetchJson<{ bookings?: UnifiedBookingItem[] }>("/api/bookings/unified", { cache: "no-store" }).then(
      (res) => {
        setBookings(res.data?.bookings || []);
        setLoadingBookings(false);
      }
    );
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return (
    <>
      <FadeIn className="mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Consultancy <span className="text-gradient-gold">Services</span>
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Track your bookings, book a slot with your purchased service, and view purchase history
        </p>
      </FadeIn>

      <FadeIn className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                active ? "bg-gold text-white shadow-md shadow-gold/20" : "glass-card text-text-body hover:text-gold"
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </FadeIn>

      {tab === "purchases" && (
        <PurchaseHistoryList
          itemType="service"
          title="My"
          titleAccent="Purchases"
          emptyLabel="No consultancy service purchases yet"
          hideNextStep
          hideHeader
        />
      )}

      {tab === "book" && <SlotsBookingPanel />}

      {tab === "bookings" && (
        <FadeIn>
          <div className="rounded-2xl glass-card p-5">
            <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-bold text-text-primary">
              <Calendar className="h-5 w-5 text-gold" /> My Booking Requests
            </h2>
            <p className="mb-4 text-sm text-text-muted">Pending and confirmed consultation bookings</p>
            {loadingBookings ? (
              <p className="text-sm text-text-muted">Loading…</p>
            ) : (
              <UnifiedBookingsList bookings={bookings} onChanged={loadBookings} />
            )}
          </div>
        </FadeIn>
      )}
    </>
  );
}

export default function DashboardServicesPage() {
  return (
    <PageTransition>
      <Suspense fallback={<p className="py-12 text-center text-text-muted">Loading…</p>}>
        <ServicesTabs />
      </Suspense>
    </PageTransition>
  );
}
