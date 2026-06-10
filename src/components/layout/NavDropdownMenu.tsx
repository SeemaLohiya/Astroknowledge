"use client";

import { cn } from "@/lib/cn";
import { NavDropdown } from "@/lib/i18n/nav-i18n";
import { ArrowRight, BookOpen, ChevronRight, Package, Sparkles } from "lucide-react";
import Link from "next/link";

const ICONS: Record<string, typeof Sparkles> = {
  "/services": Sparkles,
  "/courses": BookOpen,
  "/products": Package,
};

interface NavDropdownMenuProps {
  dropdown: NavDropdown;
  viewAllLabel: string;
  pathname: string;
}

export function NavDropdownMenu({ dropdown, viewAllLabel, pathname }: NavDropdownMenuProps) {
  const Icon = ICONS[dropdown.href] || Sparkles;
  const active = pathname.startsWith(dropdown.href);

  return (
    <div className="group relative">
      <Link
        href={dropdown.href}
        className={cn(
          "relative flex items-center gap-1 px-3 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl",
          active
            ? "text-gold font-bold bg-gradient-to-r from-gold/12 to-orange/8 shadow-sm"
            : "text-text-primary hover:text-gold hover:bg-white/80 hover:shadow-md"
        )}
      >
        <Icon className={cn("h-4 w-4 opacity-70 transition-transform duration-300 group-hover:scale-110", active && "text-gold")} />
        {dropdown.label}
        <svg
          className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
        {active && <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-gold to-gold-bright nav-tab-underline" />}
      </Link>

      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-full z-50 w-[min(100vw-2rem,320px)] -translate-x-1/2 pt-3",
          "opacity-0 invisible translate-y-3 scale-95",
          "group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100",
          "transition-all duration-300 ease-[cubic-bezier(0.22,0.68,0.2,1)]"
        )}
      >
        <div className="nav-dropdown-panel relative overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-2xl shadow-orange/15 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-orange/10 to-transparent opacity-60" />
          <div className="nav-dropdown-shine pointer-events-none absolute inset-0" />

          <Link
            href={dropdown.href}
            className="relative flex items-center gap-3 border-b border-gold/15 bg-gradient-to-br from-gold/15 via-orange/8 to-amber-50 px-4 py-4 transition-all hover:brightness-105"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-gold shadow-md ring-2 ring-gold/20">
              <Icon className="h-5 w-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gold">
                {viewAllLabel} {dropdown.label}
              </p>
              <p className="text-[11px] text-text-body truncate">Browse complete catalog</p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 animate-icon-bounce text-gold" />
          </Link>

          <div className="relative max-h-[340px] overflow-y-auto py-2">
            {dropdown.items.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-dropdown-item group/item mx-2 flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-orange text-xs font-bold text-white shadow-sm">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-text-primary group-hover/item:text-gold transition-colors">
                    {item.label}
                  </span>
                  <span className="block text-[11px] leading-snug text-text-body">{item.desc}</span>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-gold/0 transition-all duration-300 group-hover/item:text-gold group-hover/item:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
