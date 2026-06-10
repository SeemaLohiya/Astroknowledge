"use client";

import { cn } from "@/lib/cn";
import Link from "next/link";
import { User } from "lucide-react";

interface AnimatedProfileButtonProps {
  href: string;
  className?: string;
}

/** Clean profile avatar — soft glow on hover, no spinning clutter */
export function AnimatedProfileButton({ href, className }: AnimatedProfileButtonProps) {
  return (
    <Link
      href={href}
      title="My Account"
      className={cn("group relative flex h-11 w-11 items-center justify-center", className)}
    >
      <span
        className="absolute inset-0 rounded-full bg-gold/25 opacity-0 blur-md transition-all duration-500 group-hover:opacity-100 group-hover:scale-125"
        aria-hidden
      />
      <span
        className="absolute inset-0 rounded-full bg-gradient-to-br from-gold to-orange opacity-90 shadow-md shadow-gold/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange/40 group-hover:scale-105"
        aria-hidden
      />
      <span
        className="absolute inset-[3px] rounded-full bg-cream/95 transition-colors duration-300 group-hover:bg-white"
        aria-hidden
      />
      <User className="relative h-[22px] w-[22px] text-gold transition-all duration-300 group-hover:scale-110 group-hover:text-orange" />
      <span
        className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-cream bg-green-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
    </Link>
  );
}
