"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { FounderImage } from "@/components/animations/FounderImage";
import { PageTransition } from "@/components/animations/PageTransition";
import { useProfile } from "@/components/profile/ProfileGate";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { localizedTitle } from "@/lib/i18n/site-content";
import { isBirthProfileComplete } from "@/lib/profile";
import { useCatalog } from "@/lib/use-catalog";
import { Service } from "@/lib/types";
import { motion } from "framer-motion";
import { Calendar, Clock, IndianRupee } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

function BookingContent() {
  const { lang, c } = useLanguage();
  const bf = c.bookingForm;
  const d = c.dashboard;
  const ch = c.checkout;
  const { user } = useProfile();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("service") || "";
  const { items: services, loading: catalogLoading } = useCatalog<Service>("services");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    serviceId: preselected || "",
    date: "",
    time: "",
    notes: "",
    dob: "",
    birthTime: "",
    birthPlace: "",
    dobUnknown: false,
    birthTimeUnknown: false,
    birthPlaceUnknown: false,
  });

  const birthOnFile = user ? isBirthProfileComplete(user) : false;

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        userName: f.userName || user.name,
        userEmail: f.userEmail || user.email,
        userPhone: f.userPhone || user.phone,
        dob: f.dob || user.dob || "",
        birthTime: f.birthTime || user.birthTime || "",
        birthPlace: f.birthPlace || user.birthPlace || "",
        dobUnknown: f.dobUnknown || !!user.dobUnknown,
        birthTimeUnknown: f.birthTimeUnknown || !!user.birthTimeUnknown,
        birthPlaceUnknown: f.birthPlaceUnknown || !!user.birthPlaceUnknown,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (services.length > 0 && !form.serviceId) {
      setForm((f) => ({ ...f, serviceId: preselected || services[0].id }));
    }
  }, [services, preselected, form.serviceId]);

  const selectedService = services.find((s) => s.id === form.serviceId) || services[0];

  const formFields = useMemo(
    () => [
      { label: ch.fullName, key: "userName", type: "text" },
      { label: ch.email, key: "userEmail", type: "email" },
      { label: ch.phone, key: "userPhone", type: "tel" },
      { label: bf.preferredDate, key: "date", type: "date" },
      { label: bf.preferredTime, key: "time", type: "time" },
    ],
    [ch, bf]
  );

  if (catalogLoading || services.length === 0) {
    return <p className="py-20 text-center text-text-muted">{bf.loadingServices}</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          serviceName: selectedService.title,
          serviceId: form.serviceId,
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      toast.success(bf.submitSuccess);
    } catch {
      toast.error(bf.submitFailed);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex min-h-[60vh] flex-col items-center justify-center py-16 px-4"
      >
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/20">
          <Clock className="h-10 w-10 text-yellow-700" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary">{bf.pendingTitle}</h2>
        <p className="mt-2 max-w-md text-center text-text-body">{bf.pendingDesc}</p>
        <p className="mt-1 text-sm text-gold">{localizedTitle(selectedService, lang)}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {user && (
            <Button href="/dashboard/bookings" variant="secondary">
              {bf.viewBookings}
            </Button>
          )}
          <Button href="/dashboard" variant="outline">
            {bf.viewDashboard}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4">
        <FadeIn className="mb-8 flex flex-col items-center gap-4 text-center">
          <FounderImage size="sm" showRing={false} />
          <h1 className="font-display text-4xl font-bold text-text-primary">
            {bf.title} <span className="text-gradient-aurora">{bf.titleAccent}</span>
          </h1>
        </FadeIn>

        <FadeIn>
          <form onSubmit={handleSubmit} className="rounded-2xl glass-card-premium p-8">
            <div className="mb-6">
              <label className="mb-2 block text-sm text-text-body">{bf.selectService}</label>
              <select
                value={form.serviceId}
                onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                className="w-full rounded-xl border border-gold/20 bg-orange/5 px-4 py-3 text-text-primary focus:border-gold focus:outline-none"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id} className="bg-cream">
                    {localizedTitle(s, lang)} — ₹{s.price.toLocaleString("en-IN")}
                  </option>
                ))}
              </select>
              <div className="mt-2 flex items-center gap-4 text-sm text-gold">
                <span className="flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  {selectedService.price.toLocaleString("en-IN")}
                </span>
                <span>{selectedService.duration}</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {formFields.map((f) => (
                <div key={f.key}>
                  <label className="mb-1 block text-sm text-text-body">{f.label}</label>
                  <input
                    type={f.type}
                    required
                    value={form[f.key as keyof typeof form] as string}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full rounded-xl border border-gold/20 bg-orange/5 px-4 py-3 text-text-primary focus:border-gold focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {birthOnFile ? (
              <div className="mt-4 rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-text-body">
                {bf.birthOnFile}
              </div>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-text-body">{d.dob.replace(":", "")}</label>
                  <input
                    type="date"
                    value={form.dob}
                    disabled={form.dobUnknown}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className="w-full rounded-xl border border-gold/20 bg-orange/5 px-4 py-3 text-text-primary focus:border-gold focus:outline-none"
                  />
                  <label className="flex items-center gap-2 text-sm text-text-body mt-2">
                    <input
                      type="checkbox"
                      checked={form.dobUnknown}
                      onChange={(e) =>
                        setForm({ ...form, dobUnknown: e.target.checked, dob: e.target.checked ? "" : form.dob })
                      }
                    />{" "}
                    {bf.dobUnknown}
                  </label>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-text-body">{d.birthTime.replace(":", "")}</label>
                  <input
                    type="time"
                    value={form.birthTime}
                    disabled={form.birthTimeUnknown}
                    onChange={(e) => setForm({ ...form, birthTime: e.target.value })}
                    className="w-full rounded-xl border border-gold/20 bg-orange/5 px-4 py-3 text-text-primary focus:border-gold focus:outline-none"
                  />
                  <label className="flex items-center gap-2 text-sm text-text-body mt-2">
                    <input
                      type="checkbox"
                      checked={form.birthTimeUnknown}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          birthTimeUnknown: e.target.checked,
                          birthTime: e.target.checked ? "" : form.birthTime,
                        })
                      }
                    />{" "}
                    {bf.birthTimeUnknown}
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm text-text-body">{d.birthPlace.replace(":", "")}</label>
                  <input
                    type="text"
                    placeholder={bf.birthPlacePlaceholder}
                    value={form.birthPlace}
                    disabled={form.birthPlaceUnknown}
                    onChange={(e) => setForm({ ...form, birthPlace: e.target.value })}
                    className="w-full rounded-xl border border-gold/20 bg-orange/5 px-4 py-3 text-text-primary focus:border-gold focus:outline-none"
                  />
                  <label className="flex items-center gap-2 text-sm text-text-body mt-2">
                    <input
                      type="checkbox"
                      checked={form.birthPlaceUnknown}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          birthPlaceUnknown: e.target.checked,
                          birthPlace: e.target.checked ? "" : form.birthPlace,
                        })
                      }
                    />{" "}
                    {bf.birthPlaceUnknown}
                  </label>
                </div>
              </div>
            )}

            <div className="mt-4">
              <label className="mb-1 block text-sm text-text-body">{bf.additionalNotes}</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-gold/20 bg-orange/5 px-4 py-3 text-text-primary focus:border-gold focus:outline-none resize-none"
              />
            </div>

            <Button type="submit" variant="secondary" size="lg" className="mt-6 w-full" disabled={loading}>
              <Calendar className="h-5 w-5" /> {loading ? bf.submitting : d.bookConsultation}
            </Button>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}

export default function BookingPage() {
  return (
    <PageTransition>
      <Suspense>
        <BookingContent />
      </Suspense>
    </PageTransition>
  );
}
