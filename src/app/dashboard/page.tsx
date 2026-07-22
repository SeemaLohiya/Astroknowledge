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
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Flame,
  Heart,
  Mail,
  Package,
  Phone,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const WORKFLOW = [
  { step: "1", title: "Browse & buy", desc: "Services, products, courses, pooja", href: "/services", icon: Sparkles },
  { step: "2", title: "Pay online", desc: "Razorpay or UPI verification", href: "/dashboard/products", icon: Package },
  { step: "3", title: "Book slot", desc: "After a paid consultancy service", href: "/dashboard/slots", icon: Calendar },
  { step: "4", title: "Get guidance", desc: "Join your consultation on time", href: "/dashboard/services", icon: Clock },
];

const SHORTCUTS = [
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/services", label: "Services", icon: Sparkles },
  { href: "/dashboard/slots", label: "Book slot", icon: Calendar },
  { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
  { href: "/dashboard/pooja", label: "Pooja", icon: Flame },
  { href: "/dashboard/healing", label: "Healing", icon: Heart },
];

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
            <h1 className="font-display text-2xl font-bold text-text-primary">
              {d.welcome}, {displayUser?.name || d.userFallback}
            </h1>
            <p className="text-text-body">{d.subtitle}</p>
          </div>
        </div>
      </FadeIn>

      {displayUser && !profileComplete && (
        <FadeIn delay={0.05} className="mb-8">
          <div className="rounded-2xl border border-dashed border-gold/30 bg-orange/5 p-6 text-center">
            <p className="mb-4 text-sm text-text-body">{d.birthIncomplete}</p>
            <FillDetailsButton variant="secondary" size="sm" />
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.06} className="mb-8">
        <div className="rounded-2xl border border-gold/15 bg-white/80 p-5">
          <h2 className="mb-1 font-semibold text-text-primary">Your simple path</h2>
          <p className="mb-4 text-xs text-text-muted">Follow these 4 steps — each card opens the right screen</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW.map((item) => (
              <Link
                key={item.step}
                href={item.href}
                className="group rounded-xl border border-gold/15 bg-orange/5 p-4 transition hover:-translate-y-0.5 hover:border-gold/40 hover:bg-gold/5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-xs font-bold text-white">
                    {item.step}
                  </span>
                  <item.icon className="h-4 w-4 text-gold" />
                </div>
                <p className="font-semibold text-text-primary group-hover:text-gold">{item.title}</p>
                <p className="mt-1 text-xs text-text-muted">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.08} className="mb-8">
        <ProgressTimeline />
      </FadeIn>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <FadeIn delay={0.1}>
          <Link href="/dashboard/products">
            <div className="rounded-2xl glass-card p-6 transition-transform hover:-translate-y-1">
              <Package className="mb-3 h-8 w-8 text-gold" />
              <p className="text-3xl font-bold text-text-primary">{purchaseCount}</p>
              <p className="text-sm text-text-muted">{d.purchases}</p>
            </div>
          </Link>
        </FadeIn>
        <FadeIn delay={0.15}>
          <Link href="/dashboard/slots">
            <div className="rounded-2xl glass-card p-6 transition-transform hover:-translate-y-1">
              <Clock className="mb-3 h-8 w-8 text-purple-light" />
              <p className="text-3xl font-bold text-text-primary">{serviceCount}</p>
              <p className="text-sm text-text-muted">{d.consultationServices}</p>
            </div>
          </Link>
        </FadeIn>
      </div>

      <FadeIn delay={0.18} className="mb-8">
        <div className="rounded-2xl glass-card p-6">
          <h2 className="mb-4 font-semibold text-text-primary">{c.common.quickActions}</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {SHORTCUTS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-gold/15 bg-orange/5 px-3 py-4 text-center text-xs font-semibold text-text-primary transition hover:border-gold/40 hover:bg-gold/10 hover:text-gold"
              >
                <s.icon className="h-5 w-5 text-gold" />
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </FadeIn>

      {displayUser && (
        <FadeIn className="mb-8">
          <div className="rounded-2xl glass-card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-text-primary">
              <UserIcon className="h-5 w-5 text-gold" /> {d.yourInfo}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-orange/5 px-4 py-3">
                <p className="text-xs text-text-muted">{d.fullName}</p>
                <p className="font-medium text-text-primary">{displayUser.name}</p>
              </div>
              <div className="rounded-xl bg-orange/5 px-4 py-3">
                <p className="flex items-center gap-1 text-xs text-text-muted">
                  <Mail className="h-3 w-3" /> {d.email}
                </p>
                <p className="text-sm font-medium text-text-primary">{displayUser.email}</p>
              </div>
              <div className="rounded-xl bg-orange/5 px-4 py-3">
                <p className="flex items-center gap-1 text-xs text-text-muted">
                  <Phone className="h-3 w-3" /> {d.phone}
                </p>
                <p className="font-medium text-text-primary">{displayUser.phone || "—"}</p>
              </div>
            </div>
            <Button href="/dashboard/profile" variant="outline" size="sm" className="mt-4">
              Edit profile
            </Button>
          </div>
        </FadeIn>
      )}

      {bookings.length > 0 && (
        <FadeIn delay={0.2} className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-text-primary">
              <Calendar className="h-5 w-5 text-gold" /> {d.yourBookings}
            </h2>
            <Link href="/dashboard/services" className="flex items-center gap-1 text-sm text-gold hover:underline">
              <ArrowRight className="h-4 w-4" />
              {d.viewAllBookings}
            </Link>
          </div>
          <div className="rounded-2xl glass-card p-6">
            <UnifiedBookingsList bookings={bookings.slice(0, 3)} />
          </div>
        </FadeIn>
      )}
    </PageTransition>
  );
}
