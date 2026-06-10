"use client";

import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { SITE } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Award, Star, Users } from "lucide-react";

const STATS = [
  { key: "experience", icon: Award, value: parseInt(SITE.experience, 10), suffix: "+", labelKey: "yearsExperience" as const, accent: "from-gold/15 to-orange/10", iconColor: "text-gold" },
  { key: "clients", icon: Users, value: 75000, suffix: "+", labelKey: "happyClients" as const, accent: "from-blue/10 to-indigo/5", iconColor: "text-blue" },
  { key: "rating", icon: Star, value: parseFloat(SITE.rating), suffix: "★", labelKey: "averageRating" as const, decimal: true, accent: "from-purple-500/10 to-gold/10", iconColor: "text-gold" },
] as const;

export function HomeStatsSection() {
  const { c } = useLanguage();

  return (
    <section className="relative border-b border-gold/10 bg-gradient-to-b from-orange/5 to-transparent py-14 overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-1/2 h-52 w-52 rounded-full bg-orange/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/4 h-56 w-56 rounded-full bg-gold-bright/15 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <RevealOnScroll key={stat.key} delay={i * 0.12} variant={i === 1 ? "scale" : "blur-up"}>
            <div
              className={`hover-lift-card group relative overflow-hidden rounded-2xl glass-card p-7 text-center bg-gradient-to-br ${stat.accent}`}
            >
              <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md shadow-orange/10 transition-transform duration-300 group-hover:scale-110">
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>

              <p className="relative font-sans text-3xl font-bold text-orange md:text-4xl tracking-tight">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimal={"decimal" in stat && stat.decimal}
                  className="text-orange"
                />
              </p>

              {stat.key === "rating" && (
                <div className="mt-2 flex justify-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-3.5 w-3.5 ${n <= 4 ? "fill-gold text-gold" : "fill-gold/30 text-gold/30"}`}
                    />
                  ))}
                </div>
              )}

              <p className="relative mt-2 font-sans text-sm font-medium text-text-muted">
                {c.stats[stat.labelKey]}
              </p>

              <div className="mx-auto mt-4 h-0.5 w-2/3 rounded-full bg-gradient-to-r from-transparent via-orange to-transparent" />
            </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
