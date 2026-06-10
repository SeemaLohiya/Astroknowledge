"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { BirthInfoDisplay } from "@/components/profile/BirthInfoDisplay";
import { SlotCalendar } from "@/components/slots/SlotCalendar";
import { fetchJson, parseResponseJson } from "@/lib/fetch-json";
import { useCatalog } from "@/lib/use-catalog";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Booking, BookingSlot, Service } from "@/lib/types";
import { bookingConfirmMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { AlertCircle, Calendar, Check, MessageCircle, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const DURATION_PRESETS = ["30 min", "45 min", "1 hr", "1.5 hr", "2 hr"];
const LEGACY_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

type SlotTab = "open" | "booked" | "pending";
type PageTab = "slots" | "requests";

export default function AdminBookingsPage() {
  const { c } = useLanguage();
  const [pageTab, setPageTab] = useState<PageTab>("slots");
  const [allSlots, setAllSlots] = useState<BookingSlot[]>([]);
  const [legacyBookings, setLegacyBookings] = useState<Booking[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [slotTab, setSlotTab] = useState<SlotTab>("open");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: "", time: "", duration: "30 min", customDuration: "" });
  const [bulk, setBulk] = useState({ startDate: "", endDate: "", times: "09:00,11:00,15:00,17:00", duration: "30 min", skipSunday: true });
  const [filters, setFilters] = useState({ date: "", client: "", service: "" });
  const { items: services } = useCatalog<Service>("services");

  const loadSlots = useCallback(async () => {
    const res = await fetchJson<{ slots?: BookingSlot[]; pendingCount?: number }>("/api/slots");
    setAllSlots(res.data?.slots || []);
    setPendingCount(res.data?.pendingCount || 0);
  }, []);

  const loadLegacy = useCallback(async () => {
    const res = await fetchJson<{ bookings?: Booking[] }>("/api/bookings");
    setLegacyBookings(res.data?.bookings || []);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadSlots(), loadLegacy()]);
    setLoading(false);
  }, [loadSlots, loadLegacy]);

  useEffect(() => { load(); }, [load]);

  const filteredSlots = useMemo(() => {
    let list = [...allSlots];
    if (slotTab === "open") list = list.filter((s) => s.status === "available" || s.status === "blocked");
    else if (slotTab === "booked") list = list.filter((s) => s.status === "booked");
    else list = list.filter((s) => s.status === "pending");

    if (filters.date) list = list.filter((s) => s.date === filters.date);
    if (filters.client) list = list.filter((s) => s.userName?.toLowerCase().includes(filters.client.toLowerCase()));
    if (filters.service) list = list.filter((s) => s.serviceId === filters.service || s.serviceName === filters.service);
    return list;
  }, [allSlots, slotTab, filters]);

  const pendingLegacy = legacyBookings.filter((b) => b.status === "pending").length;

  const handleBulkAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const times = bulk.times.split(",").map((t) => t.trim()).filter(Boolean);
    const start = new Date(bulk.startDate);
    const end = new Date(bulk.endDate);
    const slots: { date: string; time: string; duration: string }[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (bulk.skipSunday && d.getDay() === 0) continue;
      const dateStr = d.toISOString().split("T")[0];
      times.forEach((time) => slots.push({ date: dateStr, time, duration: bulk.duration }));
    }
    const res = await fetch("/api/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bulk: true, slots }),
    });
    const data = await parseResponseJson<{ count?: number; error?: string }>(res);
    if (!res.ok || !data) { toast.error(data?.error || "Bulk create failed"); return; }
    toast.success(`Created ${data.count ?? 0} slots`);
    loadSlots();
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    const duration = form.duration === "custom" ? form.customDuration : form.duration;
    const res = await fetch("/api/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: form.date, time: form.time, duration, status: "available" }),
    });
    if (!res.ok) { toast.error("Failed to add slot"); return; }
    toast.success("Slot added");
    setForm({ date: "", time: "", duration: "30 min", customDuration: "" });
    if (form.date) setFilters((f) => ({ ...f, date: form.date }));
    loadSlots();
  };

  const slotAction = async (id: string, body: Record<string, string>) => {
    await fetch(`/api/slots/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    loadSlots();
  };

  const handleDeleteSlot = async (id: string) => {
    if (!confirm("Delete this slot?")) return;
    await fetch(`/api/slots/${id}`, { method: "DELETE" });
    toast.success("Slot deleted");
    loadSlots();
  };

  const updateLegacyStatus = async (id: string, status: Booking["status"]) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    toast.success("Status updated");
    loadLegacy();
  };

  const bookedCount = allSlots.filter((s) => s.status === "booked").length;
  const openCount = allSlots.filter((s) => s.status === "available").length;

  return (
    <PageTransition>
      <FadeIn className="mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Manage <span className="text-gradient-gold">Bookings</span>
        </h1>
        <p className="text-sm text-text-body mt-1">
          Calendar slots, confirmations, and consultation requests — all in one place
        </p>
        {(pendingCount > 0 || pendingLegacy > 0) && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-gold/10 border border-gold/30 px-4 py-2 text-sm text-gold">
            <AlertCircle className="h-4 w-4" />
            {pendingCount > 0 && <span>{pendingCount} slot booking(s) awaiting confirmation</span>}
            {pendingCount > 0 && pendingLegacy > 0 && <span>·</span>}
            {pendingLegacy > 0 && <span>{pendingLegacy} direct request(s) pending</span>}
          </div>
        )}
      </FadeIn>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gold/15 bg-orange/5 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-text-primary">{openCount}</p>
          <p className="text-xs text-text-muted">Open Slots</p>
        </div>
        <div className="rounded-xl border border-amber-300/40 bg-amber-50/80 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-gold">{pendingCount}</p>
          <p className="text-xs text-text-muted">Pending Confirm</p>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-green-50/60 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-green-700">{bookedCount}</p>
          <p className="text-xs text-text-muted">Confirmed</p>
        </div>
        <div className="rounded-xl border border-gold/15 bg-white/80 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-text-primary">{pendingLegacy}</p>
          <p className="text-xs text-text-muted">Direct Requests</p>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setPageTab("slots")}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${pageTab === "slots" ? "bg-gold text-white" : "glass-card text-text-body hover:text-gold"}`}
        >
          Calendar & Slots
          {pendingCount > 0 && <span className="ml-1.5 rounded-full bg-white/30 px-1.5 text-xs">{pendingCount}</span>}
        </button>
        <button
          onClick={() => setPageTab("requests")}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${pageTab === "requests" ? "bg-gold text-white" : "glass-card text-text-body hover:text-gold"}`}
        >
          Direct Requests
          {pendingLegacy > 0 && <span className="ml-1.5 rounded-full bg-white/30 px-1.5 text-xs">{pendingLegacy}</span>}
        </button>
      </div>

      {pageTab === "slots" ? (
        <>
          <div className="mb-6 grid gap-6 lg:grid-cols-[320px_1fr]">
            <FadeIn>
              <SlotCalendar
                slots={allSlots}
                selectedDate={filters.date}
                onSelectDate={(date) => setFilters((f) => ({ ...f, date }))}
                mode="admin"
              />
            </FadeIn>

            <form onSubmit={handleAddSlot} className="rounded-2xl glass-card p-6 h-fit">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4 text-gold" /> {c.admin.addSlot}
              </h3>
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-xs text-text-muted mb-1">{c.admin.date}</label>
                  <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">{c.admin.time}</label>
                  <input type="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">{c.admin.duration}</label>
                  <select value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm">
                    {DURATION_PRESETS.map((d) => <option key={d} value={d}>{d}</option>)}
                    <option value="custom">{c.admin.customDuration}</option>
                  </select>
                </div>
                {form.duration === "custom" && (
                  <div>
                    <label className="block text-xs text-text-muted mb-1">{c.admin.customDuration}</label>
                    <input required value={form.customDuration} onChange={(e) => setForm({ ...form, customDuration: e.target.value })} placeholder="e.g. 90 min" className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm" />
                  </div>
                )}
                <button type="submit" className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-bold text-white hover:bg-gold-bright">
                  <Plus className="h-4 w-4" /> {c.admin.addSlot}
                </button>
              </div>
            </form>

            <form onSubmit={handleBulkAdd} className="rounded-2xl glass-card p-6 h-fit mt-4">
              <h3 className="font-semibold text-text-primary mb-4">Bulk create slots</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <input type="date" required value={bulk.startDate} onChange={(e) => setBulk({ ...bulk, startDate: e.target.value })} className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm" />
                <input type="date" required value={bulk.endDate} onChange={(e) => setBulk({ ...bulk, endDate: e.target.value })} className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm" />
                <input value={bulk.times} onChange={(e) => setBulk({ ...bulk, times: e.target.value })} placeholder="Times: 09:00,11:00" className="sm:col-span-2 rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm" />
                <select value={bulk.duration} onChange={(e) => setBulk({ ...bulk, duration: e.target.value })} className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm">
                  {DURATION_PRESETS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={bulk.skipSunday} onChange={(e) => setBulk({ ...bulk, skipSunday: e.target.checked })} /> Skip Sundays</label>
              </div>
              <button type="submit" className="mt-4 rounded-full bg-gold px-4 py-2 text-sm font-bold text-white">Create bulk slots</button>
            </form>
          </div>

          <div className="mb-4 flex flex-wrap gap-3">
            <input value={filters.client} onChange={(e) => setFilters({ ...filters, client: e.target.value })} placeholder={c.admin.searchClient} className="flex-1 min-w-[160px] rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm" />
            <select value={filters.service} onChange={(e) => setFilters({ ...filters, service: e.target.value })} className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm min-w-[160px]">
              <option value="">{c.admin.allServices}</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>

          <div className="mb-4 flex gap-2">
            {(["open", "pending", "booked"] as SlotTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setSlotTab(t)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${slotTab === t ? "bg-gold text-white" : "glass-card text-text-body hover:text-gold"}`}
              >
                {t === "open" ? c.admin.openSlots : t === "booked" ? c.admin.bookedSlots : c.admin.pendingSlots}
                {t === "pending" && pendingCount > 0 && <span className="ml-1.5 rounded-full bg-white/30 px-1.5 text-xs">{pendingCount}</span>}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-text-muted text-center py-8">{c.common.loading}</p>
          ) : filteredSlots.length === 0 ? (
            <p className="text-text-muted text-center py-8">{c.admin.noResults}</p>
          ) : (
            <div className="space-y-2">
              {filteredSlots.map((slot) => (
                <div key={slot.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl glass-card p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gold shrink-0" />
                    <div>
                      <p className="font-medium text-text-primary">{slot.date} at {slot.time}</p>
                      <p className="text-xs text-gold">{c.booking.duration}: {slot.duration}</p>
                      {slot.userName && (
                        <>
                          <p className="text-xs text-text-muted mt-0.5">
                            {slot.userName} — {slot.serviceName || "Consultation"}
                            {slot.userPhone && <span className="ml-1">· {slot.userPhone}</span>}
                            {slot.userEmail && <span className="ml-1">({slot.userEmail})</span>}
                          </p>
                          <BirthInfoDisplay
                            dob={slot.dob}
                            birthTime={slot.birthTime}
                            birthPlace={slot.birthPlace}
                            dobUnknown={slot.dobUnknown}
                            birthTimeUnknown={slot.birthTimeUnknown}
                            birthPlaceUnknown={slot.birthPlaceUnknown}
                          />
                        </>
                      )}
                      {slot.bookedAt && <p className="text-[10px] text-text-muted">Booked: {new Date(slot.bookedAt).toLocaleString()}</p>}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs capitalize ${
                      slot.status === "available" ? "bg-green-500/20 text-green-600" :
                      slot.status === "pending" ? "bg-yellow-500/20 text-yellow-700" :
                      slot.status === "booked" ? "bg-gold/20 text-gold" : "bg-red-500/20 text-red-500"
                    }`}>{slot.status}</span>

                    {slot.status === "pending" && (
                      <>
                        <button onClick={() => { slotAction(slot.id, { action: "confirm" }); toast.success("Booking confirmed"); }} className="flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700">
                          <Check className="h-3 w-3" /> {c.admin.confirm}
                        </button>
                        {slot.userPhone && (
                          <a
                            href={buildWhatsAppUrl(bookingConfirmMessage(slot.userName || "", slot.serviceName || "Consultation", slot.date, slot.time), slot.userPhone.replace(/\D/g, ""))}
                            target="_blank"
                            rel="noopener"
                            className="flex items-center gap-1 rounded-full bg-[#25D366] px-3 py-1 text-xs text-white hover:opacity-90"
                          >
                            <MessageCircle className="h-3 w-3" /> WhatsApp
                          </a>
                        )}
                        <button onClick={() => { slotAction(slot.id, { action: "reject" }); toast.success("Booking rejected"); }} className="flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-500 hover:bg-red-500/30">
                          <X className="h-3 w-3" /> {c.admin.reject}
                        </button>
                      </>
                    )}
                    {slot.status === "booked" && (
                      <button onClick={() => slotAction(slot.id, { action: "reject" })} className="text-xs text-gold hover:underline">{c.admin.release}</button>
                    )}
                    {slot.status === "available" && (
                      <button onClick={() => slotAction(slot.id, { status: "blocked" })} className="text-xs text-text-muted hover:underline">{c.admin.block}</button>
                    )}
                    {slot.status === "blocked" && (
                      <button onClick={() => slotAction(slot.id, { status: "available" })} className="text-xs text-gold hover:underline">{c.admin.release}</button>
                    )}
                    <button onClick={() => handleDeleteSlot(slot.id)} className="p-1 text-red-400 hover:bg-red-400/10 rounded"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <p className="text-sm text-text-muted mb-4">
            Consultation requests submitted via the booking form (without calendar slot selection).
          </p>
          {loading ? (
            <p className="text-text-muted text-center py-8">{c.common.loading}</p>
          ) : legacyBookings.length === 0 ? (
            <p className="text-text-muted text-center py-8">No direct requests yet</p>
          ) : (
            <div className="space-y-3">
              {legacyBookings.map((b) => (
                <div key={b.id} className="rounded-2xl glass-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-text-primary">{b.serviceName}</p>
                      <p className="text-sm text-text-muted">{b.userName} · {b.userEmail} · {b.userPhone}</p>
                      <p className="text-xs text-text-muted">{b.date} at {b.time}</p>
                      <BirthInfoDisplay
                        dob={b.dob}
                        birthTime={b.birthTime}
                        birthPlace={b.birthPlace}
                        dobUnknown={b.dobUnknown}
                        birthTimeUnknown={b.birthTimeUnknown}
                        birthPlaceUnknown={b.birthPlaceUnknown}
                        className="text-xs text-text-body mt-1"
                      />
                      {b.notes && <p className="text-xs text-text-body mt-1">{b.notes}</p>}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={b.status}
                        onChange={(e) => updateLegacyStatus(b.id, e.target.value as Booking["status"])}
                        className="rounded-lg border border-gold/30 bg-cream px-3 py-2 text-sm text-text-primary capitalize"
                      >
                        {LEGACY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {b.status === "confirmed" && b.userPhone && (
                        <a
                          href={buildWhatsAppUrl(bookingConfirmMessage(b.userName, b.serviceName, b.date, b.time), b.userPhone.replace(/\D/g, ""))}
                          target="_blank"
                          rel="noopener"
                          className="flex items-center gap-1 rounded-full bg-[#25D366] px-3 py-1 text-xs text-white"
                        >
                          <MessageCircle className="h-3 w-3" /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </PageTransition>
  );
}
