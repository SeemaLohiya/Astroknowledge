"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { ZodiacTabsPanel } from "@/components/zodiac/ZodiacTabsPanel";

/** Standalone clickable 12-rashi section for catalog pages. */
export function ZodiacSection() {
  return (
    <section className="border-t border-gold/10 bg-gradient-to-b from-orange/[0.04] to-transparent py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <FadeIn scroll>
          <ZodiacTabsPanel />
        </FadeIn>
      </div>
    </section>
  );
}
