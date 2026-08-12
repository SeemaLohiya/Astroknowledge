"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { PageBanner } from "@/components/ui/PageBanner";
import { RichText } from "@/lib/legal/rich-text";
import type { LegalDocument } from "@/lib/legal/types";
import { FileText, Sparkles } from "lucide-react";

interface LegalDocumentPageProps {
  document: LegalDocument;
  breadcrumbLabel: string;
}

export function LegalDocumentPage({ document, breadcrumbLabel }: LegalDocumentPageProps) {
  const { title, lastUpdated, intro, sections, closing } = document;

  return (
    <PageTransition>
      <PageBanner
        title={title}
        subtitle={`Last Updated: ${lastUpdated}`}
        alignLeft
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: breadcrumbLabel },
        ]}
      />

      <section className="pb-20 pt-4">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-10 w-full rounded-2xl border border-gold/20 bg-gradient-to-br from-white via-cream to-orange/5 p-6 shadow-lg shadow-gold/5 md:p-8">
              <div className="mb-4 flex items-center gap-2 text-gold">
                <FileText className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-[0.15em]">Overview</span>
              </div>
              <div className="space-y-4 text-text-body leading-relaxed">
                {intro.map((paragraph, i) => (
                  <p key={i}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
            </div>
          </FadeIn>

          <div className="grid w-full gap-6">
            {sections.map((section, i) => (
              <FadeIn key={section.heading} delay={Math.min(i * 0.04, 0.4)}>
                <article className="w-full rounded-2xl border border-gold/15 bg-white/80 glass-card p-6 md:p-8">
                  <h2 className="mb-4 font-display text-xl font-bold text-gold md:text-2xl">
                    {section.heading}
                  </h2>

                  {section.paragraphs && section.paragraphs.length > 0 && (
                    <div className="space-y-3 text-text-body leading-relaxed">
                      {section.paragraphs.map((paragraph, j) => (
                        <p key={j}>
                          <RichText text={paragraph} />
                        </p>
                      ))}
                    </div>
                  )}

                  {section.subsections && section.subsections.length > 0 && (
                    <div className="mt-4 space-y-5">
                      {section.subsections.map((subsection, j) => (
                        <div
                          key={subsection.heading ?? j}
                          className="rounded-xl border border-gold/10 bg-cream/50 p-4 md:p-5"
                        >
                          {subsection.heading && (
                            <h3 className="mb-3 text-base font-semibold text-text-primary md:text-lg">
                              {subsection.heading}
                            </h3>
                          )}
                          {subsection.paragraphs && (
                            <div className="space-y-2 text-sm text-text-body leading-relaxed md:text-base">
                              {subsection.paragraphs.map((paragraph, k) => (
                                <p key={k}>
                                  <RichText text={paragraph} />
                                </p>
                              ))}
                            </div>
                          )}
                          {subsection.bullets && subsection.bullets.length > 0 && (
                            <ul className="mt-3 space-y-2">
                              {subsection.bullets.map((item, k) => (
                                <li key={k} className="flex gap-3 text-sm text-text-body md:text-base">
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                                  <span className="leading-relaxed">
                                    <RichText text={item} />
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {subsection.trailingParagraphs && (
                            <div className="mt-3 space-y-2 text-sm text-text-body leading-relaxed md:text-base">
                              {subsection.trailingParagraphs.map((paragraph, k) => (
                                <p key={k}>
                                  <RichText text={paragraph} />
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {section.bullets && section.bullets.length > 0 && (
                    <ul className={`space-y-2.5 ${section.paragraphs?.length ? "mt-4" : ""}`}>
                      {section.bullets.map((item, j) => (
                        <li key={j} className="flex gap-3 text-text-body">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                          <span className="leading-relaxed">
                            <RichText text={item} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.trailingParagraphs && section.trailingParagraphs.length > 0 && (
                    <div className={`space-y-3 text-text-body leading-relaxed ${section.bullets?.length || section.paragraphs?.length ? "mt-4" : ""}`}>
                      {section.trailingParagraphs.map((paragraph, j) => (
                        <p key={j}>
                          <RichText text={paragraph} />
                        </p>
                      ))}
                    </div>
                  )}
                </article>
              </FadeIn>
            ))}
          </div>

          {closing && (
            <FadeIn delay={0.2}>
              <div className="mt-10 w-full rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 via-cream to-orange/10 p-6 md:p-8">
                <div className="mb-3 flex items-center gap-2 text-gold">
                  <Sparkles className="h-6 w-6" />
                  <span className="text-sm font-semibold uppercase tracking-[0.15em]">Closing Note</span>
                </div>
                <h2 className="font-display text-xl font-bold text-text-primary md:text-2xl">
                  {closing.heading}
                </h2>
                <div className="mt-4 w-full space-y-3 text-text-body leading-relaxed">
                  {closing.paragraphs.map((paragraph, i) => (
                    <p key={i}>
                      <RichText text={paragraph} />
                    </p>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
