"use client";

import type { CSSProperties } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { SITE } from "@/lib/constants";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { Award, Calendar, MapPin, Sparkles, Star, Users, Zap } from "lucide-react";
import Link from "next/link";

const SKILLS = [
  { label: "Kundali", href: "/services#kundali-vishleshan" },
  { label: "Vastu", href: "/services#vastu-consultancy" },
  { label: "Remedies", href: "/products" },
  { label: "Pooja", href: "/pooja" },
];

const ORBIT_NODES = ["◆", "◇", "◆"];

/** Warm compact expert card + AI/trendy motion layer. */
export function ExpertShowcase() {
  return (
    <div className="expert-card-wrap relative mx-auto w-full max-w-[420px] sm:max-w-[480px]">
      {/* Ambient AI glow orbs */}
      <div className="pointer-events-none absolute -left-8 top-1/4 h-28 w-28 rounded-full bg-indigo/20 blur-2xl showcase-glow" />
      <div className="pointer-events-none absolute -right-6 bottom-1/4 h-32 w-32 rounded-full bg-gold/25 blur-2xl showcase-glow-delayed" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-20 w-40 -translate-x-1/2 rounded-full bg-gold-bright/15 blur-3xl animate-aurora" />

      {/* Animated gradient border shell */}
      <div className="expert-ai-border showcase-card-enter relative rounded-[1.15rem] p-[2px]">
        <div className="expert-card-glass relative overflow-hidden rounded-2xl">
          <div className="expert-ai-mesh pointer-events-none absolute inset-0 opacity-60" />
          <div className="expert-card-shine showcase-shine pointer-events-none absolute inset-0" />
          <div className="expert-ai-scan pointer-events-none absolute inset-0" />

          <div className="relative p-5 sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="expert-badge-pulse showcase-badge-enter inline-flex items-center gap-1.5 rounded-full border border-gold/35 bg-gradient-to-r from-gold/12 via-white/80 to-indigo/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold backdrop-blur-sm">
                <Sparkles className="h-3 w-3 showcase-sparkle" />
                Chief Astrologer
              </span>
              <span className="expert-mono flex items-center gap-1 text-[10px] font-medium text-text-muted">
                <Zap className="h-3 w-3 text-indigo animate-icon-bounce" />
                {SITE.experience}+ yrs
              </span>
            </div>

            <Link href="/about" className="group block">
              <div className="relative">
                {/* AI orbit ring */}
                <div className="pointer-events-none absolute -inset-3 rounded-2xl border border-dashed border-gold/20 showcase-orbit" />
                <div className="pointer-events-none absolute -inset-5 rounded-3xl border border-indigo/10 showcase-orbit-reverse" />

                {ORBIT_NODES.map((node, i) => (
                  <span
                    key={i}
                    className="expert-orbit-node pointer-events-none absolute text-[8px] text-gold-bright/80"
                    style={{ "--node-i": i } as CSSProperties}
                  >
                    {node}
                  </span>
                ))}

                <div className="relative overflow-hidden rounded-xl border border-gold/25 shadow-lg shadow-gold/10 transition-all duration-500 group-hover:border-gold/45 group-hover:shadow-xl group-hover:shadow-gold/20 cosmic-photo-pop">
                  <div className="relative aspect-[4/5] w-full min-h-[360px] sm:min-h-[420px]">
                    <SafeImage
                      src={SITE.acharyaImage}
                      alt={`${SITE.acharya} - ${SITE.name}`}
                      fill
                      sizes="(max-width:768px) 92vw, 480px"
                      className="expert-photo-focus object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-indigo/5" />
                    <div className="cosmic-shimmer-overlay pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  <div className="showcase-float-badge absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-lg border border-white/60 bg-white/90 px-2 py-1.5 shadow-sm backdrop-blur-md cosmic-badge-flash">
                    <Award className="h-3.5 w-3.5 text-gold" />
                    <span className="text-xs font-bold text-text-primary">{SITE.experience}+</span>
                  </div>
                  <div
                    className="showcase-float-badge absolute right-2.5 top-2.5 flex items-center gap-1 rounded-lg border border-white/60 bg-white/90 px-2 py-1.5 shadow-sm backdrop-blur-md cosmic-badge-flash"
                    style={{ animationDelay: "0.8s" }}
                  >
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                    <span className="text-xs font-bold text-text-primary">{SITE.rating}</span>
                  </div>
                </div>
              </div>
            </Link>

            <div className="expert-identity relative z-10 -mt-10 px-1 sm:-mt-12">
              <div className="expert-identity-plate showcase-name-enter mx-auto max-w-[94%] text-center">
                <div className="expert-identity-aura pointer-events-none absolute inset-0" />
                <div className="expert-identity-scan pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" />

                <p className="expert-identity-om expert-sans text-[10px] font-bold tracking-[0.35em] text-gold/70">ॐ</p>

                <h2 className="expert-display expert-name-crazy relative mt-1 text-[1.4rem] font-bold leading-tight sm:text-[1.65rem]">
                  {SITE.acharya.split(" ").map((word, i) => (
                    <span
                      key={word}
                      className="expert-name-word inline-block"
                      style={{ animationDelay: `${0.15 + i * 0.12}s` }}
                    >
                      {word}
                      {i < SITE.acharya.split(" ").length - 1 ? "\u00a0" : ""}
                    </span>
                  ))}
                </h2>

                <div className="expert-identity-divider mx-auto my-2.5 h-px w-3/4" />

                <div className="expert-sans showcase-title-enter flex flex-wrap items-center justify-center gap-1.5">
                  {SITE.acharyaTitle.split(" · ").map((part, i) => (
                    <span
                      key={part}
                      className={`expert-title-chip inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide sm:text-[11px] ${
                        i === 0
                          ? "border-gold/40 bg-gradient-to-r from-gold/15 to-orange/10 text-gold"
                          : "border-indigo/30 bg-gradient-to-r from-indigo/10 to-white/80 text-indigo"
                      }`}
                      style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                    >
                      {i === 0 ? <Sparkles className="h-3 w-3" /> : <Star className="h-3 w-3 fill-current" />}
                      {part}
                    </span>
                  ))}
                </div>

                <div className="expert-sans expert-stats-crazy showcase-stat-1 mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs">
                  <span className="expert-stat-pill inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-white/90 px-2.5 py-1 font-semibold text-gold shadow-sm backdrop-blur-sm">
                    <Users className="h-3.5 w-3.5" />
                    <AnimatedCounter value={75000} suffix="+" className="expert-stat-num" />
                    <span className="text-text-body font-medium">clients</span>
                  </span>
                  <span className="expert-stat-dot h-1.5 w-1.5 rounded-full bg-indigo/50" />
                  <span className="expert-stat-pill inline-flex items-center gap-1.5 rounded-full border border-indigo/25 bg-white/90 px-2.5 py-1 font-semibold text-indigo shadow-sm backdrop-blur-sm">
                    <MapPin className="h-3.5 w-3.5 text-gold" />
                    Jaipur, Rajasthan
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3.5 flex flex-wrap justify-center gap-1.5">
              {SKILLS.map((skill, i) => (
                <Link
                  key={skill.label}
                  href={skill.href}
                  className="expert-chip showcase-tag cosmic-skill-chip rounded-full border border-gold/30 bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-gold backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-indigo/40 hover:bg-gradient-to-r hover:from-gold/10 hover:to-indigo/8 hover:shadow-md hover:shadow-gold/15"
                  style={{ animationDelay: `${0.45 + i * 0.08}s` }}
                >
                  {skill.label}
                </Link>
              ))}
            </div>

            <div className="showcase-cta-enter mt-4 grid grid-cols-2 gap-2">
              <Link
                href="/about"
                className="expert-sans group/btn flex items-center justify-center rounded-xl border border-gold/30 bg-white/90 py-2.5 text-xs font-semibold text-text-primary backdrop-blur-sm transition-all hover:border-indigo/35 hover:bg-gradient-to-r hover:from-white hover:to-indigo/5 hover:text-gold"
              >
                <span className="transition-transform group-hover/btn:translate-x-0.5">Profile →</span>
              </Link>
              <Link
                href="/booking"
                className="expert-sans cosmic-btn-fire relative flex items-center justify-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-gold via-gold-bright to-indigo py-2.5 text-xs font-semibold text-white cosmic-btn-fire-bg"
              >
                <span className="cosmic-btn-ripple pointer-events-none absolute inset-0" />
                <Calendar className="relative h-3.5 w-3.5" />
                <span className="relative">Book Now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
