"use client";

import { SITE } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { ExpertShowcase } from "./ExpertShowcase";
import { HeroJyotishBackground } from "./HeroJyotishBackground";
import { Button } from "../ui/Button";
import { Award, MessageCircle, Phone, Sparkles, Star, Users } from "lucide-react";

export function HeroSection() {
  const { c } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      <HeroJyotishBackground />

      <div className="pointer-events-none absolute -left-32 top-20 z-[2] h-64 w-64 rounded-full bg-gold/15 blur-3xl animate-breathe" />
      <div
        className="pointer-events-none absolute -right-32 bottom-10 z-[2] h-72 w-72 rounded-full bg-indigo/10 blur-3xl animate-breathe"
        style={{ animationDelay: "1.2s" }}
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-14 md:py-16 lg:flex-row lg:py-20">
        <div className="hero-copy-panel flex-1 text-center lg:text-left animate-fade-in-up">
          <div className="hero-badge-glow mb-5 inline-flex items-center gap-2 rounded-full border border-indigo/25 bg-white/85 px-4 py-2 text-sm shadow-sm backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-gold animate-icon-bounce" />
            <span className="font-semibold text-gold">{c.hero.badge}</span>
            <span className="mx-1 text-text-dim">•</span>
            <Users className="h-4 w-4 text-indigo" />
            <span className="font-medium text-indigo">75,000{c.hero.clients}</span>
          </div>

          <p className="hero-eyebrow mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo/80">
            {c.hero.title}
          </p>

          <h1 className="heading-display hero-title-main text-reveal text-4xl font-bold leading-[1.1] md:text-5xl lg:text-[3.4rem]">
            {SITE.acharya}
          </h1>

          <div className="hero-tagline-pill text-reveal-delay mt-4 inline-flex items-center gap-2 rounded-2xl border border-gold/30 bg-gradient-to-r from-gold/12 via-orange/8 to-indigo/6 px-4 py-2.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse-glow" />
            <p className="text-base font-bold text-gold md:text-lg">{c.hero.typing[0]}</p>
          </div>

          <p className="hero-desc-box animate-fade-in-up mt-5 max-w-xl text-sm leading-relaxed text-text-body md:text-base" style={{ animationDelay: "0.3s" }}>
            <span className="font-semibold text-gold">{SITE.experience} {c.hero.yearsLabel}</span>
            <span className="text-text-dim"> • </span>
            <span className="font-semibold text-indigo">{SITE.clients} {c.hero.clientsLabel}</span>
            <span className="text-text-dim"> • </span>
            <span className="font-semibold text-gold-bright">{SITE.rating}{c.hero.ratingLabel}</span>
            <span className="text-text-dim"> — </span>
            {c.hero.descTail}
          </p>

          <div className="hero-cta-pop mt-8 flex flex-wrap justify-center gap-4 lg:justify-start" style={{ animationDelay: "0.45s" }}>
            <Button href="/services" variant="secondary" size="lg">
              <Sparkles className="h-5 w-5" /> {c.offerings.exploreNow}
            </Button>
            <Button href="/courses" variant="outline" size="lg">
              {c.sections.coursesTitle}
            </Button>
            <Button href={`https://wa.me/${SITE.whatsapp}`} variant="whatsapp" size="lg">
              <MessageCircle className="h-5 w-5" /> {c.hero.whatsapp}
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
            {[
              { icon: Award, text: `${SITE.experience} ${c.hero.years}`, color: "border-gold/30 bg-gold/10 text-gold" },
              { icon: Star, text: `${SITE.rating}${c.hero.rating}`, color: "border-orange/30 bg-orange/10 text-gold-bright" },
              { icon: Phone, text: c.hero.support, color: "border-indigo/25 bg-indigo/8 text-indigo" },
            ].map((item, i) => (
              <div
                key={item.text}
                className={`hero-stat-pop flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md ${item.color}`}
                style={{ animationDelay: `${0.55 + i * 0.1}s` }}
              >
                <item.icon className="h-4 w-4" />
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-1 w-full justify-center lg:min-w-[46%] lg:justify-end lg:pl-2">
          <ExpertShowcase />
        </div>
      </div>
    </section>
  );
}
