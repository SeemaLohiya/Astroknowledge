"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { ShimmerText } from "@/components/animations/ShimmerText";
import { Button } from "@/components/ui/Button";
import { ZodiacTabsPanel } from "@/components/zodiac/ZodiacTabsPanel";
import { SITE } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Calendar, Sparkles } from "lucide-react";

export function QuickConsultCTA() {
  const { c } = useLanguage();

  return (
    <section className="relative overflow-hidden py-16">
      <div className="absolute inset-0 bg-gradient-to-r from-gold/15 via-orange/10 to-gold/15" />
      <div className="absolute inset-0 bg-mesh opacity-20" />

      <div className="relative mx-auto max-w-5xl px-4">
        <FadeIn scroll variant="zoom">
          <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-white/90 p-8 text-center shadow-xl shadow-orange/10 md:p-12">
            <Sparkles className="mx-auto mb-4 h-8 w-8 animate-pulse-glow text-gold" />
            <h2 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
              {c.hero.bookConsultation}{" "}
              <ShimmerText className="text-gradient-gold">{c.bookingForm.titleAccent}</ShimmerText>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-text-body md:text-base">
              {SITE.experience} {c.hero.yearsLabel} · {SITE.rating}{c.hero.ratingLabel} · {c.hero.descTail}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href="/dashboard/slots" variant="secondary" size="lg" className="cta-shimmer-btn">
                <Calendar className="h-5 w-5" /> {c.hero.bookConsultation}
              </Button>
              <Button href="/services" variant="outline" size="lg">
                {c.offerings.exploreNow}
              </Button>
            </div>

            <div className="mt-8 text-left">
              <ZodiacTabsPanel compact showTitle />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
