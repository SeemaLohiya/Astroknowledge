"use client";

import { cn } from "@/lib/cn";
import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "whatsapp";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

const variants = {
  primary: "bg-gradient-to-r from-gold to-gold-bright text-white shadow-md hover:shadow-lg hover:brightness-110",
  secondary: "bg-gradient-to-r from-gold to-gold-bright text-white font-bold shadow-md hover:shadow-lg hover:brightness-110",
  outline: "border-2 border-gold/50 text-gold hover:bg-gold/10 hover:border-gold",
  ghost: "text-text-body hover:bg-orange/5 hover:text-gold",
  whatsapp: "bg-[#25D366] text-white shadow-md hover:brightness-110",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({ children, href, onClick, variant = "primary", size = "md", className, type = "button", disabled }: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
    variants[variant],
    sizes[size],
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
}
