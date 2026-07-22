"use client";

import { PageTransition } from "@/components/animations/PageTransition";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { QuickConsultCTA } from "@/components/home/QuickConsultCTA";
import { CatalogActions } from "@/components/cart/CatalogActions";
import { FounderImage } from "@/components/animations/FounderImage";
import { PageBanner } from "@/components/ui/PageBanner";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { localizedBenefits, localizedDesc, localizedTitle } from "@/lib/i18n/site-content";
import { useCatalog } from "@/lib/use-catalog";
import { PoojaService } from "@/lib/types";
import { Clock, IndianRupee, Sparkles } from "lucide-react";
import { AnimatedCatalogImage } from "@/components/animations/AnimatedCatalogImage";

export default function PoojaPage() {
  const { lang, c } = useLanguage();
  const p = c.pages.pooja;
  const { items: poojaServices } = useCatalog<PoojaService>("pooja");

  return (
    <PageTransition>
      <PageBanner
        title={p.title}
        titleAccent={p.titleAccent}
        subtitle={p.subtitle}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: `${p.title} ${p.titleAccent}` }]}
        aside={<FounderImage size="md" />}
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <StaggerChildren className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {poojaServices.map((pooja) => (
                <StaggerItem key={pooja.id}>
                  <div className="group overflow-hidden rounded-2xl glass-card glass-card-hover">
                    <div className="relative">
                      <AnimatedCatalogImage
                        src={pooja.image}
                        alt={localizedTitle(pooja, lang)}
                        sizes="(max-width:768px) 100vw, 33vw"
                        frameClassName="h-48"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cream/25 to-transparent" />
                      <Sparkles className="absolute right-3 top-3 z-10 h-6 w-6 text-gold animate-pulse" />
                    </div>
                    <div className="p-6">
                      <h2 className="text-lg font-bold text-text-primary group-hover:text-gold transition-colors">
                        {localizedTitle(pooja, lang)}
                      </h2>
                      <p className="mt-2 text-sm text-text-body">{localizedDesc(pooja, lang)}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {localizedBenefits(pooja, lang).map((b) => (
                          <span key={b} className="rounded-full bg-gold/10 px-2 py-1 text-xs text-gold">
                            {b}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm text-text-muted">
                          <Clock className="h-4 w-4" />
                          {pooja.duration}
                        </span>
                        <span className="flex items-center font-bold text-gold">
                          <IndianRupee className="h-4 w-4" />
                          {pooja.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <CatalogActions
                        id={pooja.id}
                        itemType="pooja"
                        name={localizedTitle(pooja, lang)}
                        price={pooja.price}
                        image={pooja.image}
                        className="mt-4"
                      />
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
        </div>
      </section>

      <QuickConsultCTA />
    </PageTransition>
  );
}
