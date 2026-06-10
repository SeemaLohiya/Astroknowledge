"use client";

import { SITE } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { SafeImage } from "./SafeImage";

interface SiteLogoProps {
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  tagline?: string;
  className?: string;
}

const sizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

export function SiteLogo({ size = "md", showName = true, tagline, className = "" }: SiteLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5 shrink-0", className)}>
      <div className={cn("relative shrink-0 overflow-hidden rounded-full shadow-md ring-1 ring-gold/20", sizes[size])}>
        <SafeImage src={SITE.logo} alt={`${SITE.name} logo`} fill className="object-cover" priority />
      </div>
      {showName && (
        <div className="min-w-0">
          <span className="block text-lg font-bold text-text-primary leading-tight">{SITE.name}</span>
          {tagline && (
            <p className="text-[9px] text-gold tracking-widest uppercase leading-tight">{tagline}</p>
          )}
        </div>
      )}
    </div>
  );
}
