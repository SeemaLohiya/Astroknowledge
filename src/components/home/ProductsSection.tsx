"use client";

import { useCategories } from "@/lib/use-categories";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { AnimatedCatalogImage } from "@/components/animations/AnimatedCatalogImage";
import { FadeIn } from "../animations/FadeIn";
import { SectionBackdrop } from "../animations/SectionBackdrop";
import { SectionHeader } from "../ui/SectionHeader";
import { StaggerChildren, StaggerItem } from "../animations/StaggerChildren";
import { Button } from "../ui/Button";
import Link from "next/link";

export function ProductsSection() {
  const { c, lang } = useLanguage();
  const { categories } = useCategories();

  return (
    <section id="products" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-orange/5 to-transparent" />
      <SectionBackdrop variant="warm" />
      <div className="relative mx-auto max-w-screen-2xl px-4">
        <SectionHeader
          title={<>{c.sections.productsTitle.split(" ").slice(0, -1).join(" ")} <span className="text-gradient-gold">{c.sections.productsTitle.split(" ").slice(-1)[0]}</span></>}
          subtitle={c.sections.productsSubtitle}
        />

        <StaggerChildren className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((cat, index) => (
            <StaggerItem key={cat.id} index={index}>
              <Link href={`/products?category=${cat.id}`} className="group block">
                <div className="hover-lift-card overflow-hidden rounded-2xl glass-card glass-card-hover border border-gold/20">
                  <AnimatedCatalogImage
                    src={cat.image || "/images/products/p1.jpg"}
                    alt={cat.name}
                    index={index}
                    sizes="(max-width:640px) 50vw, 14vw"
                    frameClassName="aspect-square bg-orange/5"
                  />
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-bold text-text-primary group-hover:text-gold transition-colors leading-tight">
                      {lang === "hi" ? cat.nameHindi || cat.name : cat.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeIn className="mt-10 text-center">
          <Button href="/products" variant="secondary" size="lg">{c.sections.productsBtn}</Button>
        </FadeIn>
      </div>
    </section>
  );
}
