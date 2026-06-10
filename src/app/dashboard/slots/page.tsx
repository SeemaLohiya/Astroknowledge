"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { FillDetailsButton } from "@/components/profile/ProfileDetailsModal";
import { useProfile } from "@/components/profile/ProfileGate";
import { SlotCalendar } from "@/components/slots/SlotCalendar";
import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { formatMsg } from "@/lib/i18n/ui-strings";
import { isBirthProfileComplete } from "@/lib/profile";
import { fetchJson, parseResponseJson } from "@/lib/fetch-json";
import { PaidServiceItem } from "@/lib/purchases";
import { BookingSlot } from "@/lib/types";
import { Calendar, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

function SlotsContent() {
  const { c } = useLanguage();
  const d = c.dashboard;
  const { user } = useProfile();
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service") || "";
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [myBookings, setMyBookings] = useState<BookingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [paidServices, setPaidServices] = useState<PaidServiceItem[]>([]);
  const [accessLoading, setAccessLoading] = useState(true);
  const [booking, setBooking] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");

  const birthComplete = user ? isBirthProfileComplete(user) : false;

  const activeService = useMemo(() => {
    if (serviceParam) {
      return paidServices.find((s) => s.id === serviceParam) || null;
    }
    if (paidServices.length === 1) return paidServices[0];
    return null;
  }, [paidServices, serviceParam]);

  useEffect(() => {
    void Promise.all([
      fetchJson<{ slots?: BookingSlot[] }>("/api/slots"),
      fetchJson<{ slots?: BookingSlot[] }>("/api/slots?mine=true"),
      fetchJson<{ paidServices?: PaidServiceItem[] }>("/api/checkout"),
    ]).then(([slotsData, mineData, accessData]) => {
      setSlots(slotsData.data?.slots || []);
      setMyBookings(mineData.data?.slots || []);
      setPaidServices(accessData.data?.paidServices || []);
      setLoading(false);
      setAccessLoading(false);
    });
  }, []);

  const visibleSlots = useMemo(() => {
    if (!selectedDate) return slots;
    return slots.filter((s) => s.date === selectedDate);
  }, [slots, selectedDate]);

  const handleBook = async (slotId: string) => {
    if (!activeService) {
      toast.error(d.noServiceForBooking);
      return;
    }
    setBooking(slotId);
    try {
      const res = await fetch(`/api/slots/${slotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "book",
          serviceId: activeService.id,
          serviceName: activeService.name,
        }),
      });
      const data = await parseResponseJson<{ message?: string; error?: string }>(res);
      if (!res.ok || !data) throw new Error(data?.error || d.failedBook);
      toast.success(data.message || d.bookingSubmitted);
      window.location.reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : d.failedBook);
    } finally {
      setBooking(null);
    }
  };

  if (accessLoading) {
    return <p className="py-20 text-center text-text-muted">{c.common.loading}</p>;
  }

  if (paidServices.length === 0) {
    return (
      <FadeIn className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto px-4">
        <div className="rounded-full bg-gold/10 p-6 mb-6">
          <Lock className="h-12 w-12 text-gold" />
        </div>
        <h1 className="font-display text-2xl font-bold text-text-primary">{d.bookConsultation}</h1>
        <p className="mt-3 text-sm text-text-body">{d.noPaidServices}</p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Button href="/services" variant="secondary">{d.browseServices}</Button>
          <Button href="/dashboard/purchases" variant="outline">{d.purchases}</Button>
        </div>
      </FadeIn>
    );
  }

  if (!activeService && paidServices.length > 1) {
    return (
      <>
        <FadeIn className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-6 w-6 text-gold" />
            <h1 className="font-display text-2xl font-bold text-text-primary">{d.bookConsultation}</h1>
          </div>
          <p className="text-sm text-text-body">{d.multipleServices}</p>
        </FadeIn>
        <div className="space-y-3">
          {paidServices.map((service) => (
            <FadeIn key={service.id}>
              <div className="flex items-center gap-4 rounded-2xl glass-card p-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <SafeImage src={service.image} alt={service.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-primary">{service.name}</p>
                  <p className="text-xs text-text-muted">{d.paidReady}</p>
                </div>
                <Button href={`/dashboard/slots?service=${service.id}`} variant="secondary" size="sm">
                  <Calendar className="h-4 w-4" /> {d.book}
                </Button>
              </div>
            </FadeIn>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-text-muted">
          {d.orGoToPurchases}{" "}
          <Link href="/dashboard/purchases" className="text-gold hover:underline">{d.purchases}</Link>{" "}
          {d.orGoToPurchasesSuffix}
        </p>
      </>
    );
  }

  return (
    <>
      <FadeIn className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-6 w-6 text-gold" />
          <h1 className="font-display text-2xl font-bold text-text-primary">{d.bookConsultation}</h1>
        </div>
        <p className="text-sm text-text-body">{d.pickDate}</p>
      </FadeIn>

      {activeService && (
        <FadeIn className="mb-6 rounded-2xl glass-card p-4 flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
            <SafeImage src={activeService.image} alt={activeService.name} fill className="object-cover" />
          </div>
          <div>
            <p className="text-xs text-text-muted">{d.yourConsultation}</p>
            <p className="font-semibold text-text-primary">{activeService.name}</p>
          </div>
        </FadeIn>
      )}

      {!birthComplete && user ? (
        <FadeIn className="mb-6 rounded-2xl glass-card p-6 text-center">
          <h2 className="font-semibold text-text-primary mb-1">{d.birthRequired}</h2>
          <p className="text-sm text-text-body mb-5">{d.birthRequiredDesc}</p>
          <FillDetailsButton variant="secondary" size="lg" />
        </FadeIn>
      ) : (
        <>
      <div className="mb-6">
        <FadeIn>
          <SlotCalendar
            slots={slots}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            mode="user"
          />
        </FadeIn>
        {selectedDate && (
          <p className="mt-3 text-sm text-text-muted text-center">
            {d.showingSlotsFor} <strong>{selectedDate}</strong>
          </p>
        )}
      </div>

      {loading ? (
        <p className="text-text-muted text-center py-8">{c.booking.loading}</p>
      ) : visibleSlots.length === 0 ? (
        <p className="text-text-muted text-center py-8">
          {selectedDate ? formatMsg(d.noSlotsOnDate, { date: selectedDate }) : c.booking.noSlots}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleSlots.map((slot) => (
            <div key={slot.id} className="rounded-xl glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gold" />
                <div>
                  <p className="font-medium text-text-primary">{slot.date}</p>
                  <p className="text-sm text-gold">{slot.time} · {slot.duration}</p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                disabled={booking === slot.id}
                onClick={() => handleBook(slot.id)}
              >
                {booking === slot.id ? "..." : c.common.bookSlot}
              </Button>
            </div>
          ))}
        </div>
      )}

      {myBookings.length > 0 && (
        <FadeIn className="mt-10">
          <h2 className="font-semibold text-text-primary mb-4">{d.yourConsultations}</h2>
          {myBookings.map((slot) => (
            <div key={slot.id} className="mb-2 rounded-xl bg-gold/10 px-4 py-3 flex flex-wrap justify-between gap-2">
              <span className="text-text-primary text-sm">{slot.date} at {slot.time} ({slot.duration})</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gold">{slot.serviceName}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${slot.status === "pending" ? "bg-yellow-500/20 text-yellow-700" : "bg-green-500/20 text-green-700"}`}>
                  {slot.status === "pending" ? c.booking.pendingConfirm : c.booking.confirmed}
                </span>
              </div>
            </div>
          ))}
        </FadeIn>
      )}
        </>
      )}
    </>
  );
}

export default function DashboardSlotsPage() {
  const { c } = useLanguage();
  return (
    <PageTransition>
      <Suspense fallback={<p className="py-20 text-center text-text-muted">{c.common.loading}</p>}>
        <SlotsContent />
      </Suspense>
    </PageTransition>
  );
}
