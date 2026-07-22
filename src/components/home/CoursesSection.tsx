"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { localizedDesc, localizedTitle } from "@/lib/i18n/site-content";
import { useCatalog } from "@/lib/use-catalog";
import { Course } from "@/lib/types";
import { FadeIn } from "../animations/FadeIn";
import { StaggerChildren, StaggerItem } from "../animations/StaggerChildren";
import { SectionHeader } from "../ui/SectionHeader";
import { AnimatedCatalogImage } from "@/components/animations/AnimatedCatalogImage";
import { CatalogActions } from "@/components/cart/CatalogActions";
import { Button } from "../ui/Button";
import { ArrowRight, Clock, IndianRupee, Star } from "lucide-react";
import Link from "next/link";

export function CoursesSection() {
  const { c, lang } = useLanguage();
  const { items: courses } = useCatalog<Course>("courses");

  if (courses.length === 0) return null;

  return (
    <section id="courses" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-orange/5 to-transparent" />
      <div className="relative mx-auto max-w-screen-2xl px-4">
        <SectionHeader
          title={<>{c.sections.coursesTitle.split(" ").slice(0, -1).join(" ")} <span className="text-gradient-gold">{c.sections.coursesTitle.split(" ").slice(-1)[0]}</span></>}
          subtitle={c.sections.coursesSubtitle}
        />

        <StaggerChildren className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.slice(0, 4).map((course, index) => (
            <StaggerItem key={course.id} index={index}>
              <div className="hover-lift-card group relative overflow-hidden rounded-2xl glass-card glass-card-hover h-full border border-gold/15">
                <Link href={`/courses#${course.id}`} className="block">
                  {course.popular && (
                    <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-gold px-2 py-1 text-xs font-bold text-white">
                      <Star className="h-3 w-3" /> {c.sections.popular}
                    </div>
                  )}
                  <AnimatedCatalogImage
                    src={course.image}
                    alt={course.title}
                    index={index}
                    sizes="(max-width:640px) 50vw, 25vw"
                    frameClassName="h-52 bg-orange/5"
                  />
                  <div className="p-5 pb-3">
                    <h3 className="font-semibold text-text-primary group-hover:text-gold transition-colors line-clamp-2 flex items-start gap-1">
                      {localizedTitle(course, lang)}
                      <ArrowRight className="h-4 w-4 shrink-0 opacity-0 transition-all group-hover:opacity-100 text-gold" />
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-text-body">{localizedDesc(course, lang)}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm text-text-muted"><Clock className="h-3 w-3" />{course.duration}</span>
                      <span className="flex items-center gap-1 font-bold text-gold-bright"><IndianRupee className="h-4 w-4" />{course.price.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </Link>
                <div className="px-5 pb-5">
                  <CatalogActions
                    id={course.id}
                    itemType="course"
                    name={course.title}
                    price={course.price}
                    image={course.image}
                    hideBookButton
                  />
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeIn className="mt-10 text-center">
          <Button href="/courses" variant="outline" size="lg">{c.sections.viewAllCourses}</Button>
        </FadeIn>
      </div>
    </section>
  );
}
