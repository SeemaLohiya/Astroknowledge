"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { FounderImage } from "@/components/animations/FounderImage";
import { PageTransition } from "@/components/animations/PageTransition";
import { useProfile } from "@/components/profile/ProfileGate";
import { FillDetailsButton } from "@/components/profile/ProfileDetailsModal";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { fetchJson } from "@/lib/fetch-json";
import { UnifiedBookingItem } from "@/lib/types";
import { ProgressTimeline } from "@/components/dashboard/ProgressTimeline";
import { UnifiedBookingsList } from "@/components/dashboard/UnifiedBookingsList";
import { isBirthProfileComplete } from "@/lib/profile";
import { Calendar, Clock, Mail, Package, ArrowRight, Phone, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { c } = useLanguage();
  const d = c.dashboard;
  const { user: profileUser } = useProfile();
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [bookings, setBookings] = useState<UnifiedBookingItem[]>([]);

  useEffect(() => {
    if (!profileUser) return;
    void (async () => {
      const [bookingsRes, ordersRes] = await Promise.all([
        fetchJson<{ bookings?: UnifiedBookingItem[] }>("/api/bookings/unified"),
        fetchJson<{ purchases?: { items?: { itemType: string }[] }[] }>("/api/orders"),
      ]);
      setBookings(bookingsRes.data?.bookings || []);
      const purchases = ordersRes.data?.purchases || [];
      const items = purchases.flatMap((p) => p.items ?? []);
      setPurchaseCount(items.length);
      setServiceCount(items.filter((i) => i.itemType === "service").length);
    })();
  }, [profileUser?.id]);

  const displayUser = profileUser;
  const profileComplete = displayUser && isBirthProfileComplete(displayUser);

  return (
    <PageTransition>
      <FadeIn>
        <div className="mb-8 flex items-center gap-4">
          <FounderImage size="sm" showRing={false} showGlow={false} />
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary">{d.welcome}, {displayUser?.name || d.userFallback}</h1>
            <p className="text-text-body">{d.subtitle}</p>
          </div>
        </div>
      </FadeIn>

      {displayUser && (
        <FadeIn className="mb-8">
          <div className="rounded-2xl glass-card p-6">
            <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-gold" /> {d.yourInfo}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-orange/5 px-4 py-3">
                <p className="text-xs text-text-muted">{d.fullName}</p>
                <p className="font-medium text-text-primary">{displayUser.name}</p>
              </div>
              <div className="rounded-xl bg-orange/5 px-4 py-3">
                <p className="text-xs text-text-muted flex items-center gap-1"><Mail className="h-3 w-3" /> {d.email}</p>
                <p className="font-medium text-text-primary text-sm">{displayUser.email}</p>
              </div>
              <div className="rounded-xl bg-orange/5 px-4 py-3">
                <p className="text-xs text-text-muted flex items-center gap-1"><Phone className="h-3 w-3" /> {d.phone}</p>
                <p className="font-medium text-text-primary">{displayUser.phone || "—"}</p>
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {displayUser && !profileComplete && (
        <FadeIn delay={0.05} className="mb-8">
          <div className="rounded-2xl border border-dashed border-gold/30 bg-orange/5 p-6 text-center">
            <p className="text-sm text-text-body mb-4">{d.birthIncomplete}</p>
            <FillDetailsButton variant="secondary" size="sm" />
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.08} className="mb-8">
        <ProgressTimeline />
      </FadeIn>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <FadeIn delay={0.1}>
          <Link href="/dashboard/products">
            <div className="rounded-2xl glass-card p-6 transition-transform hover:-translate-y-1">
              <Package className="h-8 w-8 text-gold mb-3" />
              <p className="text-3xl font-bold text-text-primary">{purchaseCount}</p>
              <p className="text-sm text-text-muted">{d.purchases}</p>
            </div>
          </Link>
        </FadeIn>
        <FadeIn delay={0.15}>
          <Link href="/dashboard/slots">
            <div className="rounded-2xl glass-card p-6 transition-transform hover:-translate-y-1">
              <Clock className="h-8 w-8 text-purple-light mb-3" />
              <p className="text-3xl font-bold text-text-primary">{serviceCount}</p>
              <p className="text-sm text-text-muted">{d.consultationServices}</p>
            </div>
          </Link>
        </FadeIn>
      </div>

      {bookings.length > 0 && (
        <FadeIn delay={0.2} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-primary flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gold" /> {d.yourBookings}
            </h2>
            <Link href="/dashboard/services" className="flex items-center gap-1 text-sm text-gold hover:underline">
              <ArrowRight className="h-4 w-4" />{d.viewAllBookings}
            </Link>
          </div>
          <div className="rounded-2xl glass-card p-6">
            <UnifiedBookingsList bookings={bookings.slice(0, 3)} />
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.25}>
        <div className="rounded-2xl glass-card p-6">
          <h2 className="font-semibold text-text-primary mb-4">{c.common.quickActions}</h2>
          <div className="flex flex-wrap gap-3">
            <Button href="/dashboard/products" variant="secondary" size="sm">{d.purchases}</Button>
            <Button href="/dashboard/slots" variant="outline" size="sm">{d.bookConsultation}</Button>
            <Button href="/services" variant="outline" size="sm">{d.browseServices}</Button>
          </div>
        </div>
      </FadeIn>

      {purchaseCount > 0 && (
        <FadeIn delay={0.3} className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-primary">{d.recentPurchases}</h2>
            <Link href="/dashboard/products" className="flex items-center gap-1 text-sm text-gold hover:underline">
              <ArrowRight className="h-4 w-4" />{d.viewAll}
            </Link>
          </div>
          <p className="text-sm text-text-muted">{d.purchasesHint}</p>
        </FadeIn>
      )}
    </PageTransition>
  );
}
