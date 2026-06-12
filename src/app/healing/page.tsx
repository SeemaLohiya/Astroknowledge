"use client";

import { AnimatedCatalogImage } from "@/components/animations/AnimatedCatalogImage";
import { PageTransition } from "@/components/animations/PageTransition";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { CatalogActions } from "@/components/cart/CatalogActions";
import { PageBanner } from "@/components/ui/PageBanner";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { localizedDesc, localizedTitle } from "@/lib/i18n/site-content";
import { useCatalog } from "@/lib/use-catalog";
import { HealingService } from "@/lib/types";
import { Check, Heart, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function HealingPage() {
  const { lang, c } = useLanguage();
  const { items: healing } = useCatalog<HealingService>("healing", { live: true });

  return (
    <PageTransition>
      <PageBanner
        title="Healing"
        titleAccent="Services"
        subtitle="Reiki, crystal, theta healing & mantra sadhana — restore balance, release blocks, and awaken inner light."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Healing" }]}
      />

      <section className="relative overflow-hidden py-12 md:py-16">
        <motion.div
          className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl"
          animate={{ x: [0, 40, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="relative mx-auto max-w-7xl px-4">
          <RevealOnScroll variant="fade-down" className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-300/50 bg-gradient-to-r from-rose-50 to-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-600">
              <Heart className="h-3.5 w-3.5" />
              Spiritual Healing
            </span>
          </RevealOnScroll>

          <StaggerChildren className="grid gap-8 md:grid-cols-2">
            {healing.map((item, index) => (
              <StaggerItem key={item.id} index={index} variant={index % 2 === 0 ? "fade-up" : "fade-left"}>
                <div
                  id={item.id}
                  className="group overflow-hidden rounded-2xl border border-gold/20 bg-white/95 shadow-sm transition-all hover:border-rose-300/40 hover:shadow-xl hover:shadow-rose-200/20"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full shrink-0 sm:w-56">
                      <AnimatedCatalogImage
                        src={item.image}
                        alt={localizedTitle(item, lang)}
                        sizes="(max-width:640px) 100vw, 224px"
                        variant="cover"
                        frameClassName="h-56 w-full sm:h-full sm:min-h-[14rem]"
                      />
                      {item.popular && (
                        <span className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-gold px-2.5 py-1 text-xs font-bold text-white">
                          <Star className="h-3 w-3" /> Popular
                        </span>
                      )}
                      <Sparkles className="absolute right-3 top-3 z-10 h-5 w-5 text-gold animate-pulse-glow" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="text-xl font-bold text-text-primary group-hover:text-gold transition-colors">
                        {localizedTitle(item, lang)}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-text-body">{localizedDesc(item, lang)}</p>
                      <ul className="mt-3 space-y-1.5">
                        {item.benefits.map((b) => (
                          <li key={b} className="flex items-center gap-2 text-xs text-text-muted">
                            <Check className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                            {b}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-xs text-gold font-medium">{item.duration}</p>
                      <div className="mt-4 border-t border-gold/10 pt-4">
                        <CatalogActions
                          id={item.id}
                          itemType="healing"
                          name={localizedTitle(item, lang)}
                          price={item.price}
                          image={item.image}
                          bookLabel={c.cart.proceedToCheckout}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </PageTransition>
  );
}
