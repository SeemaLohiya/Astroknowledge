"use client";

import { SectionBackdrop } from "@/components/animations/SectionBackdrop";
import { FadeIn } from "@/components/animations/FadeIn";
import { ShimmerText } from "@/components/animations/ShimmerText";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface PageBannerProps {
  title: string;
  titleAccent?: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  aside?: React.ReactNode;
  className?: string;
}

export function PageBanner({ title, titleAccent, subtitle, breadcrumbs, aside, className }: PageBannerProps) {
  return (
    <div className={`relative overflow-hidden border-b border-gold/10 bg-gradient-to-b from-orange/5 to-transparent py-12 md:py-16 ${className ?? ""}`}>
      <SectionBackdrop variant="soft" />
      <div className="relative mx-auto max-w-7xl px-4">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs text-text-muted" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`} className="inline-flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-gold transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gold font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <FadeIn className={`flex flex-col gap-8 ${aside ? "lg:flex-row lg:items-center" : "items-center text-center"}`}>
          <div className={aside ? "flex-1 text-center lg:text-left" : "max-w-3xl"}>
            <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl lg:text-5xl">
              {title}{" "}
              {titleAccent ? <ShimmerText className="text-gradient-gold">{titleAccent}</ShimmerText> : null}
            </h1>
            {subtitle && <p className="mt-4 text-base text-text-body md:text-lg">{subtitle}</p>}
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </FadeIn>
      </div>
    </div>
  );
}
