"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { SITE } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

interface PolicyPageProps {
  title: string;
  sections: { heading: string; content: string }[];
}

export function PolicyPage({ title, sections }: PolicyPageProps) {
  const { c } = useLanguage();
  return (
    <PageTransition>
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <FadeIn className="mb-12 text-center">
            <h1 className="font-display text-4xl font-bold text-text-primary">{title}</h1>
            <p className="mt-2 text-text-muted">{SITE.name} — {c.policy.lastUpdated}</p>
          </FadeIn>
          <div className="space-y-8">
            {sections.map((section, i) => (
              <FadeIn key={section.heading} delay={i * 0.1}>
                <div className="rounded-2xl glass-card p-6">
                  <h2 className="text-xl font-semibold text-gold mb-3">{section.heading}</h2>
                  <p className="text-text-body leading-relaxed">{section.content}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
