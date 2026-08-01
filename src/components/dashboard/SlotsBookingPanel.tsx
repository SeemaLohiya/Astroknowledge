"use client";

import { FadeIn } from "@/components/animations/FadeIn";
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
import { Calendar, Clock, Lock, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

function SlotsBookingContent() {
  const { c } = useLanguage();
  const d = c.dashboard;
  const { user, loading: profileLoading } = useProfile();
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

  const reload = () => {
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
  };

  useEffect(() => {
    reload();
  }, []);

  const visibleSlots = useMemo(() => {
    if (!selectedDate) return slots;
    return slots.filter((s) => s.date === selectedDate);
  }, [slots, selectedDate]);

  const myBookingsSection =
    myBookings.length > 0 ? (
      <FadeIn className="mb-6">
        <h2 className="mb-3 flex items-center gap-2 font-semibold text-text-primary">
          <Clock className="h-4 w-4 text-gold" />
          {d.yourConsultations}
        </h2>
        {myBookings.map((slot) => (
          <div
            key={slot.id}
            className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-gold/10 px-4 py-3"
          >
            <span className="text-sm text-text-primary">
              {slot.date} at {slot.time} ({slot.duration})
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gold">{slot.serviceName}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${slot.status === "pending" ? "bg-yellow-500/20 text-yellow-700" : slot.status === "completed" ? "bg-blue-500/20 text-blue-700" : "bg-green-500/20 text-green-700"}`}
              >
                {slot.status === "pending"
                  ? c.booking.pendingConfirm
                  : slot.status === "completed"
                    ? "Completed"
                    : c.booking.confirmed}
              </span>
            </div>
          </div>
        ))}
      </FadeIn>
    ) : null;

  const paidServicesSection = (
    <FadeIn className="mb-6">
      <h2 className="mb-3 font-semibold text-text-primary">Your purchased services</h2>
      <p className="mb-3 text-sm text-text-muted">
        {paidServices.length > 1 ? d.multipleServices : "Book a slot using your purchased consultancy service below"}
      </p>
      <div className="space-y-3">
        {paidServices.map((service) => {
          const booked = myBookings.filter((b) => b.serviceId === service.id);
          const latest = booked[0];
          const isActive = activeService?.id === service.id;
          return (
            <div
              key={service.id}
              className={`flex items-center gap-4 rounded-2xl glass-card p-4 ${isActive ? "ring-2 ring-gold/40" : ""}`}
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                <SafeImage src={service.image} alt={service.name} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-text-primary">{service.name}</p>
                <p className="text-xs text-text-muted">
                  {latest
                    ? `${latest.date} ${latest.time} · ${latest.status === "pending" ? c.booking.pendingConfirm : c.booking.confirmed}`
                    : d.paidReady}
                </p>
              </div>
              {paidServices.length > 1 ? (
                <Button href={`/dashboard/services?tab=book&service=${service.id}`} variant="secondary" size="sm">
                  <Calendar className="h-4 w-4" /> {latest ? "Book again" : d.book}
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>
    </FadeIn>
  );

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
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : d.failedBook);
    } finally {
      setBooking(null);
    }
  };

  if (accessLoading || profileLoading) {
    return <p className="py-12 text-center text-text-muted">{c.common.loading}</p>;
  }

  if (paidServices.length === 0) {
    return (
      <FadeIn className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-gold/10 p-5">
          <Lock className="h-10 w-10 text-gold" />
        </div>
        <p className="text-sm text-text-body">{d.noPaidServices}</p>
        <Button href="/services" variant="secondary" className="mt-4">
          {d.exploreServices}
        </Button>
      </FadeIn>
    );
  }

  if (!activeService && paidServices.length > 1) {
    return (
      <div className="space-y-2">
        {myBookingsSection}
        {paidServicesSection}
      </div>
    );
  }

  return (
    <>
      {myBookingsSection}
      {paidServicesSection}

      {!birthComplete ? (
        <FadeIn className="mb-6 rounded-2xl glass-card p-6 text-center">
          <h2 className="mb-1 font-semibold text-text-primary">{d.birthRequired}</h2>
          <p className="mb-5 text-sm text-text-body">{d.birthRequiredDesc}</p>
          <FillDetailsButton variant="secondary" size="lg" />
        </FadeIn>
      ) : activeService ? (
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
              <p className="mt-3 text-center text-sm text-text-muted">
                {d.showingSlotsFor} <strong>{selectedDate}</strong>
              </p>
            )}
          </div>

          {loading ? (
            <p className="py-8 text-center text-text-muted">{c.booking.loading}</p>
          ) : visibleSlots.length === 0 ? (
            <p className="py-8 text-center text-text-muted">
              {selectedDate ? formatMsg(d.noSlotsOnDate, { date: selectedDate }) : c.booking.noSlots}
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {visibleSlots.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between rounded-xl glass-card p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gold" />
                    <div>
                      <p className="font-medium text-text-primary">{slot.date}</p>
                      <p className="text-sm text-gold">
                        {slot.time} · {slot.duration}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={booking === slot.id}
                    onClick={() => void handleBook(slot.id)}
                  >
                    {booking === slot.id ? "..." : c.common.bookSlot}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <FadeIn className="mb-6 rounded-2xl border border-dashed border-gold/25 bg-orange/5 p-6 text-center text-sm text-text-muted">
          Choose a purchased service above to pick a date and book your consultation slot.
        </FadeIn>
      )}
    </>
  );
}

export function SlotsBookingPanel() {
  const { c } = useLanguage();
  const d = c.dashboard;

  return (
    <div>
      <FadeIn className="mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-gold" />
          <h2 className="font-display text-xl font-bold text-text-primary">{d.bookConsultation}</h2>
        </div>
        <p className="mt-1 text-sm text-text-muted">{d.pickDate}</p>
        <p className="text-xs text-text-muted">{d.onlineSessionNote}</p>
      </FadeIn>
      <Suspense fallback={<p className="py-8 text-center text-text-muted">{c.common.loading}</p>}>
        <SlotsBookingContent />
      </Suspense>
    </div>
  );
}
