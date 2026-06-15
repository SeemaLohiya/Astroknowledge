"use client";

import type { ReactNode } from "react";
import { SITE, telLink } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { BookOpen, Copy, Flame, Heart, Phone, Sparkles, Star, Tag, Zap } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type ChipVariant = "intro" | "kundli" | "vastu" | "clients" | "default" | "code" | "phone" | "pooja";

function MarqueeChip({
  icon: Icon,
  children,
  variant = "default",
  href,
}: {
  icon: typeof Sparkles;
  children: ReactNode;
  variant?: ChipVariant;
  href?: string;
}) {
  const className = `promo-marquee-chip inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-transform sm:text-sm ${
    variant === "intro"
      ? "promo-intro-chip border border-amber-100/50 bg-gradient-to-r from-amber-500/50 via-orange/45 to-rose-500/40 font-bold text-white shadow-md"
      : variant === "kundli"
        ? "border border-violet-200/40 bg-gradient-to-r from-violet-600/45 to-indigo-500/40 text-white"
        : variant === "vastu"
          ? "border border-teal-200/40 bg-gradient-to-r from-teal-600/40 to-emerald-500/35 text-white"
          : variant === "clients"
            ? "border border-rose-200/40 bg-gradient-to-r from-rose-500/40 to-pink-500/35 text-white"
            : variant === "code"
              ? "promo-code-glow border border-white/40 bg-white/15 text-white"
              : variant === "phone"
                ? "border border-white/25 bg-white/10 text-white"
                : variant === "pooja"
                  ? "promo-pooja-chip border border-amber-200/60 bg-gradient-to-r from-amber-400/35 via-orange/30 to-gold/35 font-bold text-white shadow-lg"
                  : "border border-white/15 bg-white/8 text-white/95"
  }`;

  const inner = (
    <>
      <Icon
        className={`h-3.5 w-3.5 shrink-0 ${
          variant === "pooja"
            ? "text-amber-100 animate-icon-bounce"
            : variant === "code"
              ? "text-cream"
              : variant === "intro"
                ? "text-amber-50 animate-icon-bounce"
                : "text-cream/90"
        }`}
      />
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  if (variant === "phone") {
    return (
      <a href={telLink()} className={className}>
        {inner}
      </a>
    );
  }

  return <span className={className}>{inner}</span>;
}

/** Animated top promo strip — intro marquee with colors; works on mobile. */
export function PromoBanner() {
  const { t, c } = useLanguage();

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(SITE.discountCode);
      toast.success(`Code ${SITE.discountCode} copied!`);
    } catch {
      toast.error("Could not copy code");
    }
  };

  const segments = [
    { icon: Star, label: SITE.tagline, variant: "intro" as const },
    { icon: Sparkles, label: t("expertVedic"), variant: "kundli" as const },
    { icon: BookOpen, label: "Kundali · Dasha · Remedies", variant: "kundli" as const, href: "/services" },
    { icon: Zap, label: "Vastu · Numerology · Palmistry", variant: "vastu" as const, href: "/services" },
    { icon: Heart, label: `${SITE.clients} Happy Clients`, variant: "clients" as const },
    { icon: Tag, label: "code", variant: "code" as const },
    { icon: Flame, label: t("pooja"), variant: "pooja" as const, href: "/pooja" },
    { icon: Zap, label: `${SITE.experience}+ Years · ${SITE.rating}★ Rated`, variant: "default" as const },
    { icon: Phone, label: SITE.phone, variant: "phone" as const },
  ];

  const track = [...segments, ...segments, ...segments];

  return (
    <div className="promo-banner group/banner relative overflow-hidden border-b border-white/20">
      <div className="promo-banner-gradient pointer-events-none absolute inset-0" />
      <div className="promo-banner-mesh pointer-events-none absolute inset-0 opacity-40" />
      <div className="promo-banner-shine pointer-events-none absolute inset-0" />
      <div className="promo-banner-sparks pointer-events-none absolute inset-0" />

      <div className="relative flex min-h-[2.5rem] items-center sm:min-h-[2.75rem]">
        <div className="promo-marquee flex-1 overflow-hidden py-2">
          <div className="promo-marquee-track flex w-max items-center gap-3 px-2 sm:gap-4">
            {track.map((seg, i) => (
              <MarqueeChip
                key={`${seg.label}-${i}`}
                icon={seg.icon}
                variant={seg.variant}
                href={"href" in seg ? seg.href : undefined}
              >
                {seg.variant === "code" ? (
                  <>
                    {c.common.discountBanner}{" "}
                    <strong className="promo-code-text font-extrabold tracking-wide">{SITE.discountCode}</strong>{" "}
                    {c.discountForPercent} {SITE.discountPercent}% {c.percentOff}
                  </>
                ) : seg.variant === "pooja" ? (
                  <>
                    <span className="promo-pooja-text">{t("pooja")}</span>
                    <span className="rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-50">
                      New
                    </span>
                  </>
                ) : (
                  seg.label
                )}
              </MarqueeChip>
            ))}
          </div>
        </div>

        <div className="promo-banner-actions hidden shrink-0 items-center gap-2 border-l border-white/25 bg-black/10 px-3 py-1.5 backdrop-blur-sm md:flex">
          <Link
            href="/pooja"
            className="promo-pooja-side inline-flex items-center gap-1.5 rounded-full border border-amber-200/50 bg-gradient-to-r from-amber-500/40 to-orange/40 px-3 py-1 text-xs font-bold text-white transition-all hover:scale-110"
          >
            <Flame className="h-3.5 w-3.5 animate-icon-bounce" />
            {t("pooja")}
          </Link>
          <button
            type="button"
            onClick={copyCode}
            className="promo-code-btn group inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-white/15 px-3 py-1 text-xs font-bold text-white transition-all hover:scale-110 hover:bg-white/25"
          >
            <Tag className="h-3.5 w-3.5 text-cream" />
            {SITE.discountCode}
            <Copy className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100" />
          </button>
          <a
            href={telLink()}
            className="promo-phone-btn inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white transition-all hover:scale-110 hover:bg-white/20"
          >
            <Phone className="h-3.5 w-3.5" />
            {SITE.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
