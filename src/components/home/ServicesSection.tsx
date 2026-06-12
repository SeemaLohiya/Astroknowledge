"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { localizedDesc, localizedTitle } from "@/lib/i18n/site-content";
import { useCatalog } from "@/lib/use-catalog";
import { Service } from "@/lib/types";
import { FadeIn } from "../animations/FadeIn";
import { StaggerChildren, StaggerItem } from "../animations/StaggerChildren";
import { SectionHeader } from "../ui/SectionHeader";
import { AnimatedCatalogImage } from "@/components/animations/AnimatedCatalogImage";
import { CatalogActions } from "@/components/cart/CatalogActions";
import { Button } from "../ui/Button";
import { ArrowRight, Clock, IndianRupee, Star } from "lucide-react";
import Link from "next/link";

export function ServicesSection() {
  const { c, lang } = useLanguage();
  const { items: services } = useCatalog<Service>("services");

  return (
    <section id="services" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-15" />
      <div className="relative mx-auto max-w-7xl px-4">
        <SectionHeader
          title={<>{c.sections.servicesTitle.split(" ").slice(0, -1).join(" ")} <span className="text-gradient-gold">{c.sections.servicesTitle.split(" ").slice(-1)[0]}</span></>}
          subtitle={c.sections.servicesSubtitle}
        />

        <StaggerChildren className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.slice(0, 7).map((service, index) => (
            <StaggerItem key={service.id} index={index}>
              <div className="hover-lift-card group relative overflow-hidden rounded-2xl glass-card glass-card-hover h-full border border-gold/10">
                <Link href={`/services#${service.id}`} className="block">
                  {service.popular && (
                    <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-gold px-2 py-1 text-xs font-bold text-white">
                      <Star className="h-3 w-3" /> {c.sections.popular}
                    </div>
                  )}
                  <AnimatedCatalogImage
                    src={service.image}
                    alt={service.title}
                    index={index}
                    sizes="(max-width:640px) 50vw, 280px"
                    variant="contain"
                    frameClassName="relative h-48 bg-gradient-to-br from-orange/10 to-gold/5"
                  />
                  <div className="p-5 pb-3">
                    <h3 className="font-semibold text-text-primary group-hover:text-gold transition-colors line-clamp-2 flex items-start gap-1">
                      {localizedTitle(service, lang)}
                      <ArrowRight className="h-4 w-4 shrink-0 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-gold" />
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-text-body">{localizedDesc(service, lang)}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm text-text-muted"><Clock className="h-3 w-3" />{service.duration}</span>
                      <span className="flex items-center gap-1 font-bold text-gold-bright"><IndianRupee className="h-4 w-4" />{service.price.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </Link>
                <div className="px-5 pb-5">
                  <CatalogActions
                    id={service.id}
                    itemType="service"
                    name={service.title}
                    price={service.price}
                    image={service.image}
                    hideBookButton
                  />
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeIn scroll className="mt-10 text-center">
          <Button href="/services" variant="outline" size="lg">{c.sections.viewAllServices}</Button>
        </FadeIn>
      </div>
    </section>
  );
}
