"use client";

import { problemCategories as staticProblems } from "@/lib/data/content";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { PROBLEM_SERVICE_LINKS } from "@/lib/problem-links";
import { useEditableContent } from "@/lib/use-editable-content";
import { uiStrings } from "@/lib/i18n/ui-strings";
import { FadeIn } from "../animations/FadeIn";
import { SectionBackdrop } from "../animations/SectionBackdrop";
import { StaggerChildren, StaggerItem } from "../animations/StaggerChildren";
import { SectionHeader } from "../ui/SectionHeader";
import { SafeImage } from "@/components/ui/SafeImage";
import { Button } from "../ui/Button";
import Link from "next/link";

export function ProblemsSection() {
  const { lang, c } = useLanguage();
  const { content } = useEditableContent();
  const problems = content?.problemCategories?.length ? content.problemCategories : staticProblems;

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-10" />
      <SectionBackdrop variant="soft" />
      <div className="relative mx-auto max-w-7xl px-4">
        <SectionHeader
          title={<span className="text-gradient-gold">{c.sections.problemsTitle}</span>}
          subtitle={c.sections.problemsSubtitle}
        />

        <StaggerChildren className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem) => {
            const hi = lang === "hi" ? uiStrings.hi.problemsHindi[problem.id as keyof typeof uiStrings.hi.problemsHindi] : null;
            const description = hi?.description || problem.description;
            const remedies = hi?.remedies || problem.remedies;
            return (
              <StaggerItem key={problem.id}>
                <Link href={PROBLEM_SERVICE_LINKS[problem.id] || "/services"}>
                  <div className="group overflow-hidden rounded-2xl glass-card glass-card-hover">
                    <div className="relative h-44 overflow-hidden bg-orange/5">
                      <SafeImage
                        src={problem.image}
                        alt={lang === "hi" ? problem.titleHindi : problem.title}
                        fill
                        sizes="(max-width:640px) 50vw, 25vw"
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 pt-3">
                      <h3 className="flex items-center gap-2 font-semibold text-text-primary group-hover:text-gold transition-colors">
                        <span className="text-lg leading-none">{problem.icon}</span>
                        {lang === "hi" ? problem.titleHindi : problem.title}
                      </h3>
                      <p className="mt-2 text-sm text-text-body line-clamp-2">{description}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {remedies.slice(0, 2).map((r) => (
                          <span key={r} className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] text-gold">{r}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        <FadeIn className="mt-10 text-center">
          <Button href="/contact" variant="outline" size="lg">{c.problems.contactCta}</Button>
        </FadeIn>
      </div>
    </section>
  );
}
