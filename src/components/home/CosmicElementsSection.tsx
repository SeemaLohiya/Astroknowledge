"use client";

import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { SectionBackdrop } from "@/components/animations/SectionBackdrop";
import { NAVGRAHA, NavgrahaPlanet } from "@/lib/data/navgraha";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/cn";
import { Calendar, Gem, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const ELEMENTS = [
  { name: "Fire", hindi: "अग्नि", signs: "Aries, Leo, Sagittarius", color: "#EF4444", icon: "🔥" },
  { name: "Earth", hindi: "पृथ्वी", signs: "Taurus, Virgo, Capricorn", color: "#22C55E", icon: "🌍" },
  { name: "Air", hindi: "वायु", signs: "Gemini, Libra, Aquarius", color: "#60A5FA", icon: "💨" },
  { name: "Water", hindi: "जल", signs: "Cancer, Scorpio, Pisces", color: "#818CF8", icon: "💧" },
];

function PlanetDetail({ planet, burst }: { planet: NavgrahaPlanet; burst: number }) {
  const { c, lang } = useLanguage();
  const hi = lang === "hi";

  return (
    <div
      key={`${planet.id}-${burst}`}
      className="navgraha-detail-card navgraha-portal-enter relative overflow-hidden rounded-2xl border p-6 md:p-8"
      style={{
        borderColor: `${planet.color}55`,
        boxShadow: `0 16px 48px ${planet.glow}, 0 0 80px ${planet.glow}, inset 0 1px 0 rgba(255,255,255,0.9)`,
        "--planet-color": planet.color,
        "--planet-glow": planet.glow,
      } as CSSProperties}
    >
      <div className="navgraha-shockwave pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2" style={{ borderColor: planet.color }} />
      <div
        className="navgraha-detail-glow pointer-events-none absolute inset-0 opacity-50"
        style={{ background: `radial-gradient(ellipse at 25% 35%, ${planet.glow}, transparent 65%)` }}
      />
      <div className="navgraha-detail-shine pointer-events-none absolute inset-0" />
      <div className="navgraha-holo-scan pointer-events-none absolute inset-0" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-start">
        <div className="flex shrink-0 flex-col items-center md:items-start">
          <div className="navgraha-planet-orbit navgraha-orbit-crazy relative">
            <span className="navgraha-satellite navgraha-satellite-1" style={{ background: planet.color }} />
            <span className="navgraha-satellite navgraha-satellite-2" style={{ background: planet.color }} />
            <span className="navgraha-satellite navgraha-satellite-3" style={{ background: planet.color }} />
            <div
              className="navgraha-planet-core navgraha-core-warp flex h-24 w-24 items-center justify-center rounded-full border-2 text-5xl"
              style={{ borderColor: planet.color, color: planet.color, background: `radial-gradient(circle at 35% 35%, white, ${planet.glow})` }}
            >
              {planet.symbol}
            </div>
          </div>
          <h4 className="navgraha-name-flash mt-4 font-display text-2xl font-bold text-text-primary">{hi ? planet.nameHindi : planet.name}</h4>
          <p className="text-sm font-semibold" style={{ color: planet.color }}>{hi ? planet.roleHindi : planet.role}</p>
        </div>

        <div className="flex-1 space-y-5">
          <div className="navgraha-text-reveal">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gold">{c.sections.navgrahaGoverns}</p>
            <p className="text-sm leading-relaxed text-text-body">{hi ? planet.governsHindi : planet.governs}</p>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold">{c.sections.navgrahaInfluences}</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {(hi ? planet.influencesHindi : planet.influences).map((item, i) => (
                <li
                  key={item}
                  className="navgraha-influence-pop flex items-start gap-2 rounded-lg border border-gold/10 bg-white/60 px-2.5 py-2 text-sm text-text-body backdrop-blur-sm"
                  style={{ animationDelay: `${0.15 + i * 0.08}s` }}
                >
                  <Star className="mt-0.5 h-3 w-3 shrink-0 text-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Calendar, label: c.sections.navgrahaDay, value: hi ? planet.dayHindi : planet.day },
              { icon: Gem, label: c.sections.navgrahaGemstone, value: hi ? planet.gemstoneHindi : planet.gemstone },
              { icon: Sparkles, label: c.sections.navgrahaNature, value: hi ? planet.natureHindi : planet.nature },
            ].map((fact, i) => (
              <div
                key={fact.label}
                className="navgraha-fact-card rounded-xl border px-3 py-2.5 transition-all hover:-translate-y-1 hover:shadow-md"
                style={{
                  borderColor: `${planet.color}33`,
                  background: `linear-gradient(135deg, white, ${planet.glow})`,
                  animationDelay: `${0.35 + i * 0.1}s`,
                }}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase" style={{ color: planet.color }}>
                  <fact.icon className="h-3 w-3" />
                  {fact.label}
                </div>
                <p className="mt-1 text-xs font-medium text-text-primary">{fact.value}</p>
              </div>
            ))}
          </div>

          <div
            className="navgraha-remedy-box rounded-xl border px-4 py-3"
            style={{ borderColor: `${planet.color}40`, background: `${planet.glow}` }}
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gold">{c.sections.navgrahaRemedy}</p>
            <p className="text-sm text-text-body">{hi ? planet.remedyHindi : planet.remedy}</p>
          </div>

          <Link
            href="/services"
            className="navgraha-book-cta relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold via-gold-bright to-orange px-4 py-3.5 text-sm font-bold text-white shadow-lg sm:w-auto hover:opacity-90 transition-opacity"
          >
            <Calendar className="h-4 w-4" />
            <span>{c.offerings.exploreNow}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CosmicElementsSection() {
  const { c, lang } = useLanguage();
  const [selected, setSelected] = useState<NavgrahaPlanet>(NAVGRAHA[0]);
  const [burst, setBurst] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const pickPlanet = useCallback((planet: NavgrahaPlanet) => {
    setSelected(planet);
    setBurst((b) => b + 1);
    indexRef.current = NAVGRAHA.findIndex((p) => p.id === planet.id);
  }, []);

  useEffect(() => {
    if (paused || isMobile) return;
    const timer = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % NAVGRAHA.length;
      const next = NAVGRAHA[indexRef.current];
      setSelected(next);
      setBurst((b) => b + 1);
    }, 5500);
    return () => clearInterval(timer);
  }, [paused, isMobile]);

  const planetStyle = {
    "--planet-color": selected.color,
    "--planet-glow": selected.glow,
  } as CSSProperties;

  return (
    <section
      className={cn("navgraha-cosmos relative overflow-hidden py-16 md:py-24", isMobile && "navgraha-lite")}
      style={planetStyle}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="navgraha-ambient pointer-events-none absolute inset-0" />
      <div className="navgraha-ambient-2 pointer-events-none absolute inset-0" />
      <div className="absolute inset-0 bg-aurora opacity-20" />
      <SectionBackdrop variant="cosmic" />
      <div className="navgraha-stars pointer-events-none absolute inset-0 opacity-40" />
      <div className="navgraha-constellation pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-screen-2xl px-4">
        <RevealOnScroll variant="blur-up" className="mb-12 text-center">
          <h2 className="heading-display text-3xl font-bold md:text-4xl">
            {c.sections.cosmicTitle.split(" ")[0]}{" "}
            <span className="text-gradient-gold">{c.sections.cosmicTitle.split(" ").slice(1).join(" ") || "Elements"}</span> &{" "}
            <span className="navgraha-title-pulse text-gradient-gold">Planets</span>
          </h2>
          <p className="body-text mt-3">{c.sections.cosmicSubtitle}</p>
        </RevealOnScroll>

        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ELEMENTS.map((el, i) => (
            <RevealOnScroll key={el.name} delay={i * 0.08} variant="scale">
              <div className="navgraha-element-card group glass-card glass-card-hover rounded-2xl p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
                <span className="mb-3 block text-4xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">{el.icon}</span>
                <h3 className="font-bold text-text-primary">{el.name}</h3>
                <p className="text-xs text-gold">{el.hindi}</p>
                <p className="mt-2 text-xs text-text-muted">{el.signs}</p>
                <div className="navgraha-element-bar mt-3 h-1.5 rounded-full" style={{ "--el-color": el.color } as CSSProperties} />
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll variant="zoom">
          <div className="navgraha-panel navgraha-panel-crazy relative overflow-hidden rounded-3xl glass-card p-6 md:p-8">
            <div className="navgraha-panel-ring pointer-events-none absolute inset-4 rounded-2xl border border-dashed" style={{ borderColor: `${selected.color}33` }} />
            <div className="navgraha-panel-ring-2 pointer-events-none absolute inset-8 rounded-2xl border border-dashed border-gold/10" />

            <div className="relative mb-2 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-bold text-text-primary md:text-2xl">{c.sections.navgrahaTitle}</h3>
                <p className="mt-1 text-sm text-text-muted">{c.sections.navgrahaHint}</p>
              </div>
              <span className="navgraha-graha-badge inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold" style={{ borderColor: `${selected.color}44`, color: selected.color, background: selected.glow }}>
                <Sparkles className="h-3.5 w-3.5 animate-icon-bounce" /> 9 Grahas
              </span>
            </div>

            <div className="relative my-6">
              <div className="navgraha-tab-beam pointer-events-none absolute bottom-0 left-0 right-0 h-px opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${selected.color}, transparent)` }} />
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3 lg:grid-cols-9">
                {NAVGRAHA.map((planet) => {
                  const isActive = selected.id === planet.id;
                  return (
                    <button
                      key={planet.id}
                      type="button"
                      onClick={() => pickPlanet(planet)}
                      className={cn(
                        "navgraha-tab relative rounded-2xl p-3 text-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                        isActive
                          ? "navgraha-tab-active z-10 scale-110 -translate-y-2 bg-white shadow-xl"
                          : "border border-gold/15 bg-orange/10 hover:scale-105 hover:border-gold/40 hover:-translate-y-1"
                      )}
                      style={
                        isActive
                          ? { boxShadow: `0 8px 32px ${planet.glow}, 0 0 24px ${planet.color}44`, borderColor: planet.color }
                          : undefined
                      }
                      aria-pressed={isActive}
                      aria-label={`${planet.name} — ${planet.role}`}
                    >
                      {isActive && (
                        <>
                          <span className="navgraha-tab-ping pointer-events-none absolute inset-0 rounded-2xl" style={{ borderColor: planet.color }} />
                          <span className="navgraha-tab-glow pointer-events-none absolute -inset-1 rounded-2xl opacity-60" style={{ background: `radial-gradient(circle, ${planet.glow}, transparent 70%)` }} />
                        </>
                      )}
                      <span className="relative block text-2xl transition-transform duration-300 md:text-3xl" style={{ color: planet.color }}>
                        {planet.symbol}
                      </span>
                      <p className="relative mt-1 text-[10px] font-semibold text-text-primary md:text-xs">
                        {lang === "hi" ? planet.nameHindi.split("(")[0].trim() : planet.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <PlanetDetail planet={selected} burst={burst} />

            {!paused && (
              <p className="navgraha-auto-hint mt-4 text-center text-[10px] font-medium uppercase tracking-widest text-text-muted">
                Auto-cycling grahas · hover to pause
              </p>
            )}
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
}
