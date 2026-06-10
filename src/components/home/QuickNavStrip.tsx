"use client";

import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/cn";
import { ArrowRight, BookOpen, Calendar, Flame, Package, Sparkles } from "lucide-react";
import Link from "next/link";

const TABS = [
  { href: "/services", key: "services" as const, icon: Sparkles, color: "from-gold to-orange", ring: "ring-gold/30" },
  { href: "/courses", key: "courses" as const, icon: BookOpen, color: "from-gold to-orange", ring: "ring-gold/30" },
  { href: "/products", key: "products" as const, icon: Package, color: "from-orange to-gold-bright", ring: "ring-orange/30" },
  { href: "/pooja", key: "pooja" as const, icon: Flame, color: "from-amber-500 to-gold", ring: "ring-amber-300/50", highlight: true },
  { href: "/booking", key: "book" as const, icon: Calendar, color: "from-teal to-emerald-500", ring: "ring-teal/30", isBook: true },
];

export function QuickNavStrip() {
  const { c } = useLanguage();
  const o = c.offerings;
  const bookLabel = c.hero.bookConsultation;

  const labels: Record<string, string> = {
    services: o.services,
    courses: o.courses,
    products: o.products,
    pooja: o.pooja,
    book: bookLabel,
  };

  return (
    <section className="quick-nav-strip relative overflow-hidden border-y border-gold/15 bg-gradient-to-r from-orange/5 via-white to-gold/5 py-6">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-[0.12]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4">
        <RevealOnScroll variant="fade-down">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
            Explore · Consult · Transform
          </p>
        </RevealOnScroll>

        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {TABS.map((tab, i) => (
            <RevealOnScroll key={tab.href} delay={i * 0.07} variant={i % 2 === 0 ? "fade-up" : "scale"}>
            <Link
              href={tab.href}
              className={cn(
                "group flex shrink-0 items-center gap-2.5 rounded-2xl border px-4 py-3 shadow-sm ring-1 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg sm:px-5",
                tab.highlight
                  ? "border-amber-300/60 bg-gradient-to-r from-amber-50 to-orange/10 ring-amber-300/50 hover:from-gold/15 hover:to-orange/15 promo-pooja-chip"
                  : tab.isBook
                    ? "border-teal/30 bg-gradient-to-br from-teal/5 to-emerald/5 ring-teal/25 hover:border-teal/50"
                    : "border-white/80 bg-white/90",
                tab.ring
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                  tab.color
                )}
              >
                <tab.icon className={cn("h-5 w-5", tab.highlight && "animate-icon-bounce")} />
              </span>
              <span
                className={cn(
                  "pr-1 text-sm font-semibold transition-colors",
                  tab.highlight ? "text-gold group-hover:text-gold-bright" : tab.isBook ? "text-teal-700 group-hover:text-teal-900" : "text-text-primary group-hover:text-gold"
                )}
              >
                {labels[tab.key]}
              </span>
              {!tab.isBook && (
                <span className="quick-tab-hint hidden text-[10px] font-medium text-gold/80 opacity-0 transition-opacity group-hover:opacity-100 lg:inline">
                  + Consult
                </span>
              )}
            </Link>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={0.35} variant="zoom" className="mt-4 flex justify-center">
          <Link
            href="/booking"
            className="cta-shimmer-btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-orange px-5 py-2 text-sm font-bold text-white shadow-md transition-transform hover:scale-105 hover:shadow-lg animate-border-glow"
          >
            <Calendar className="h-4 w-4" />
            {bookLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
