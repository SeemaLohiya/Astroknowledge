"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { Marquee } from "@/components/animations/Marquee";
import { ShimmerText } from "@/components/animations/ShimmerText";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Shield, Truck, Sparkles, CreditCard } from "lucide-react";

const icons = [Shield, Sparkles, Truck, CreditCard, Shield, Sparkles];

function BadgeItem({ title, sub, i }: { title: string; sub: string; i: number }) {
  const Icon = icons[i % icons.length];
  return (
    <div className="hover-lift-card group flex shrink-0 items-center gap-3 rounded-xl border border-gold/10 bg-white px-5 py-3 transition-colors hover:border-gold/30">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gold/20 to-orange/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
        <Icon className="icon-wiggle-hover h-5 w-5 text-gold" />
      </div>
      <div>
        <p className="font-semibold text-text-primary text-sm">{title}</p>
        <p className="text-xs text-text-muted">{sub}</p>
      </div>
    </div>
  );
}

export function TrustBadges() {
  const { c } = useLanguage();
  return (
    <section className="relative border-y border-gold/10 py-6 overflow-hidden">
      <FadeIn scroll className="relative mb-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          <ShimmerText>{c.trustBadges[0]?.title || "Trusted"}</ShimmerText>
        </p>
      </FadeIn>
      <Marquee speed="slow" className="relative">
        <div className="flex gap-6 px-4">
          {c.trustBadges.map((badge, i) => (
            <BadgeItem key={i} title={badge.title} sub={badge.sub} i={i} />
          ))}
        </div>
      </Marquee>
    </section>
  );
}
