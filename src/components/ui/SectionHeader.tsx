import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: React.ReactNode;
  subtitle?: string;
  align?: "center" | "left";
}

export function SectionHeader({ badge, badgeIcon: BadgeIcon, title, subtitle, align = "center" }: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <RevealOnScroll variant="blur-up" className={`mb-14 max-w-3xl ${alignClass}`}>
      {badge && (
        <RevealOnScroll delay={0.05} variant="scale">
          <span className="section-badge mb-5 inline-flex">
            {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5" />}
            {badge}
          </span>
        </RevealOnScroll>
      )}
      <RevealOnScroll delay={0.1} variant="fade-up">
        <h2 className="heading-display text-3xl font-bold text-text-primary md:text-4xl lg:text-5xl">
          {title}
        </h2>
      </RevealOnScroll>
      {subtitle && (
        <RevealOnScroll delay={0.18} variant="fade-up">
          <p className="body-text mt-4 text-base font-medium text-text-body md:text-lg">
            {subtitle}
          </p>
        </RevealOnScroll>
      )}
      <div className="section-divider-animated mt-8" />
    </RevealOnScroll>
  );
}
