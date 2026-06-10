"use client";

import { SITE } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useEditableContent } from "@/lib/use-editable-content";
import { AuroraRays } from "../animations/AuroraRays";
import { RevealOnScroll } from "../animations/RevealOnScroll";
import { SectionBackdrop } from "../animations/SectionBackdrop";
import { SectionHeader } from "../ui/SectionHeader";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FAQSection() {
  const { c, lang } = useLanguage();
  const { content } = useEditableContent();
  const faqs = content?.faqs[lang === "hi" ? "hi" : "en"] || c.faqs;

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-20" />
      <AuroraRays className="opacity-60" />
      <SectionBackdrop variant="soft" />

      <div className="relative mx-auto max-w-3xl px-4">
        <SectionHeader
          badge={c.sections.faqBadge}
          badgeIcon={HelpCircle}
          title={<>{c.sections.faqTitle.split(" ").slice(0, -1).join(" ")} <span className="text-gradient-gold">{c.sections.faqTitle.split(" ").slice(-1)[0]}</span></>}
          subtitle={`${c.sections.faqSubtitle.replace("years", SITE.experience)}`}
        />

        <Accordion.Root type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <RevealOnScroll key={i} delay={i * 0.06} variant="fade-up">
              <Accordion.Item
                value={`faq-${i}`}
                className="hover-lift-card overflow-hidden rounded-xl glass-card border border-white/5 transition-colors data-[state=open]:border-gold/30 data-[state=open]:shadow-lg data-[state=open]:shadow-gold/10"
              >
                <Accordion.Trigger className="group flex w-full items-center justify-between p-5 text-left font-semibold text-text-primary hover:text-gold transition-colors">
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className="h-5 w-5 text-gold transition-transform duration-300 group-data-[state=open]:rotate-180 shrink-0" />
                </Accordion.Trigger>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <div className="px-5 pb-5 text-sm text-text-body leading-relaxed border-t border-gold/10 pt-4">
                    {faq.a}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </RevealOnScroll>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
