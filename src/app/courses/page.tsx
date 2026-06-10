"use client";

import { PageTransition } from "@/components/animations/PageTransition";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { QuickConsultCTA } from "@/components/home/QuickConsultCTA";
import { CatalogActions } from "@/components/cart/CatalogActions";
import { FounderImage } from "@/components/animations/FounderImage";
import { PageBanner } from "@/components/ui/PageBanner";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { localizedDesc, localizedFeatures, localizedSessionDesc, localizedTitle } from "@/lib/i18n/site-content";
import { useCatalog } from "@/lib/use-catalog";
import { Course } from "@/lib/types";
import { Check, Clock, IndianRupee, Star } from "lucide-react";
import { AnimatedCatalogImage } from "@/components/animations/AnimatedCatalogImage";

export default function CoursesPage() {
  const { lang, c } = useLanguage();
  const p = c.pages.courses;
  const { items: courses } = useCatalog<Course>("courses");

  return (
    <PageTransition>
      <PageBanner
        title={p.title}
        titleAccent={p.titleAccent}
        subtitle={p.subtitle}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: p.title }]}
        aside={<FounderImage size="md" />}
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <StaggerChildren className="grid gap-8 md:grid-cols-2">
              {courses.map((course) => {
                const sessionDesc = localizedSessionDesc(course, lang);
                return (
                  <StaggerItem key={course.id}>
                    <div className="group overflow-hidden rounded-2xl glass-card glass-card-hover">
                      <div id={course.id} className="flex flex-col sm:flex-row">
                        <div className="relative shrink-0">
                          <AnimatedCatalogImage
                            src={course.image}
                            alt={localizedTitle(course, lang)}
                            sizes="224px"
                            frameClassName="h-52 w-full sm:h-56 sm:w-56"
                          />
                          {course.popular && (
                            <span className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-gold px-2 py-1 text-xs font-bold text-white">
                              <Star className="h-3 w-3" /> {c.sections.popular}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 p-6">
                          <h2 className="text-xl font-bold text-text-primary group-hover:text-gold transition-colors">
                            {localizedTitle(course, lang)}
                          </h2>
                          <p className="mt-2 text-sm text-text-body">{localizedDesc(course, lang)}</p>
                          {sessionDesc && (
                            <div className="mt-4 rounded-xl border border-gold/15 bg-orange/[0.04] p-4">
                              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gold">{p.sessionDetails}</h3>
                              <div className="space-y-2">
                                {sessionDesc.split(/\n\n+/).filter(Boolean).map((para, i) => (
                                  <p key={i} className="text-xs leading-relaxed text-text-body">
                                    {para.trim()}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                          <ul className="mt-3 space-y-1">
                            {localizedFeatures(course, lang).map((f) => (
                              <li key={f} className="flex items-center gap-2 text-xs text-text-muted">
                                <Check className="h-3 w-3 text-gold" />
                                {f}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="flex items-center gap-1 text-sm text-text-muted">
                              <Clock className="h-4 w-4" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1 text-lg font-bold text-gold">
                              <IndianRupee className="h-5 w-5" />
                              {course.price.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <CatalogActions
                            id={course.id}
                            itemType="course"
                            name={localizedTitle(course, lang)}
                            price={course.price}
                            image={course.image}
                            className="mt-4"
                          />
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
        </div>
      </section>

      <QuickConsultCTA />
    </PageTransition>
  );
}
