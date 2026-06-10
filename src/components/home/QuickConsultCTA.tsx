"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ShimmerText } from "@/components/animations/ShimmerText";
import { Button } from "@/components/ui/Button";
import { SITE, ZODIAC_SIGNS } from "@/lib/constants";
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
              <Button href="/booking" variant="secondary" size="lg" className="cta-shimmer-btn">
                <Calendar className="h-5 w-5" /> {c.hero.bookConsultation}
              </Button>
              <Button href="/services" variant="outline" size="lg">
                {c.offerings.exploreNow}
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {ZODIAC_SIGNS.map((sign, i) => (
                <RevealOnScroll key={sign.sign} delay={i * 0.04} variant="scale">
                  <span className="inline-block rounded-full border border-gold/20 bg-cream px-2.5 py-1 text-xs text-text-body transition-colors hover:border-gold/50 hover:bg-gold/10 hover:scale-110">
                    {sign.symbol} {sign.sign}
                  </span>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
