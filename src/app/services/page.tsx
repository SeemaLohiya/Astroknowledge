"use client";

import { FounderImage } from "@/components/animations/FounderImage";
import { PageTransition } from "@/components/animations/PageTransition";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { QuickConsultCTA } from "@/components/home/QuickConsultCTA";
import { ZodiacSection } from "@/components/zodiac/ZodiacSection";
import { CatalogActions } from "@/components/cart/CatalogActions";
import { PageBanner } from "@/components/ui/PageBanner";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { localizedDesc, localizedFeatures, localizedTitle } from "@/lib/i18n/site-content";
import { useCatalog } from "@/lib/use-catalog";
import { Service } from "@/lib/types";
import { Check, Clock, IndianRupee, Sparkles, Star } from "lucide-react";
import { AnimatedCatalogImage } from "@/components/animations/AnimatedCatalogImage";
import Link from "next/link";

export default function ServicesPage() {
  const { lang, c } = useLanguage();
  const p = c.pages.services;
  const { items: services } = useCatalog<Service>("services");

  return (
    <PageTransition>
      <PageBanner
        title={p.title}
        titleAccent={p.titleAccent}
        subtitle={p.subtitle}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: p.title }]}
        aside={<FounderImage size="md" />}
      />

      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-orange/8 via-transparent to-gold/5" />

        <div className="relative mx-auto max-w-7xl px-4">
          <RevealOnScroll variant="fade-down" className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/50 bg-gradient-to-r from-gold/15 to-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold">
              <Sparkles className="h-3.5 w-3.5 animate-icon-bounce" />
              Vedic Consultancy Services
            </span>
          </RevealOnScroll>

          <StaggerChildren className="grid gap-8 md:grid-cols-2">
            {services.map((service, index) => (
              <StaggerItem key={service.id} index={index} variant={index % 2 === 0 ? "fade-up" : "fade-right"}>
                <div className="hover-lift-card group overflow-hidden rounded-2xl border border-gold/20 bg-white/90 shadow-sm transition-all hover:border-orange/40 hover:shadow-lg hover:shadow-orange/10">
                  <div id={service.id} className="flex flex-col sm:flex-row">
                    <div className="relative w-full shrink-0 sm:w-52">
                      <AnimatedCatalogImage
                        src={service.image}
                        alt={localizedTitle(service, lang)}
                        index={index}
                        sizes="(max-width:640px) 100vw, 208px"
                        variant="contain"
                        frameClassName="h-52 w-full bg-gradient-to-br from-orange/10 to-gold/5 sm:h-full sm:min-h-[13rem]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-orange/5" />
                      <Sparkles className="absolute right-3 top-3 z-10 h-5 w-5 text-gold animate-pulse-glow" />
                      {service.popular && (
                        <span className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-gold to-orange px-2.5 py-1 text-xs font-bold text-white shadow-md">
                          <Star className="h-3 w-3" /> {c.sections.popular}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="text-xl font-bold text-text-primary transition-colors group-hover:text-gold">
                        {localizedTitle(service, lang)}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-text-body">{localizedDesc(service, lang)}</p>
                      <ul className="mt-3 space-y-1.5">
                        {localizedFeatures(service, lang).map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs text-text-muted">
                            <Check className="h-3.5 w-3.5 shrink-0 text-gold" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex items-center justify-between border-t border-gold/10 pt-4">
                        <span className="flex items-center gap-1 text-sm text-text-muted">
                          <Clock className="h-4 w-4 text-orange" />
                          {service.duration}
                        </span>
                        <span className="flex items-center gap-1 text-lg font-bold text-gold">
                          <IndianRupee className="h-5 w-5" />
                          {service.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <CatalogActions
                        id={service.id}
                        itemType="service"
                        name={localizedTitle(service, lang)}
                        price={service.price}
                        image={service.image}
                        bookHref="/dashboard/slots"
                        bookLabel={c.hero.bookConsultation}
                        className="mt-4"
                      />
                      <Link
                        href="/dashboard/slots"
                        className="mt-2 text-center text-xs font-semibold text-orange transition-colors hover:text-gold sm:hidden"
                      >
                        {c.hero.bookConsultation} →
                      </Link>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <ZodiacSection />
      <QuickConsultCTA />
    </PageTransition>
  );
}
