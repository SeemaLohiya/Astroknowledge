"use client";

import { SectionBackdrop } from "@/components/animations/SectionBackdrop";
import { ShimmerText } from "@/components/animations/ShimmerText";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { ArrowRight, BookOpen, Package, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";

const OFFERING_KEYS = [
  { key: "services", href: "/services", icon: Sparkles, color: "from-gold/25 to-orange/15", accent: "text-gold", border: "hover:border-gold/50" },
  { key: "products", href: "/products", icon: Package, color: "from-orange/20 to-gold/15", accent: "text-gold", border: "hover:border-gold/50" },
  { key: "courses", href: "/courses", icon: BookOpen, color: "from-gold/20 to-orange/15", accent: "text-orange", border: "hover:border-orange/40" },
  { key: "pooja", href: "/pooja", icon: ShoppingBag, color: "from-amber-500/20 to-gold/15", accent: "text-amber-600", border: "hover:border-amber-400/50" },
] as const;

export function ExploreOfferingsSection() {
  const { c } = useLanguage();
  const o = c.offerings;

  return (
    <section id="offerings" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-10" />
      <SectionBackdrop variant="warm" />
      <div className="relative mx-auto max-w-7xl px-4">
        <SectionHeader
          title={<>{o.title} <ShimmerText className="text-gradient-gold">{o.titleAccent}</ShimmerText></>}
          subtitle={o.subtitle}
        />

        <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {OFFERING_KEYS.map((item, index) => {
            const title = o[item.key as keyof typeof o] as string;
            const desc = o[`${item.key}Desc` as keyof typeof o] as string;
            return (
              <StaggerItem key={item.key} index={index} variant={index % 2 === 0 ? "fade-up" : "fade-right"}>
                <Link
                  href={item.href}
                  className={`hover-lift-card group flex h-full flex-col rounded-2xl border border-gold/15 glass-card glass-card-hover bg-gradient-to-br ${item.color} p-6 transition-all duration-300 ${item.border}`}
                >
                  <item.icon className={`h-10 w-10 mb-4 ${item.accent} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`} />
                  <h3 className="font-display text-xl font-bold text-text-primary group-hover:text-gold transition-colors">{title}</h3>
                  <p className="mt-2 flex-1 text-sm text-text-body">{desc}</p>
                  <span className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${item.accent}`}>
                    {o.exploreNow}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
