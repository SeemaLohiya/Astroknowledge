import { cn } from "@/lib/cn";
import { ReactNode } from "react";
import { RevealOnScroll, type RevealVariant } from "./RevealOnScroll";

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
}

export function StaggerChildren({ children, className }: StaggerChildrenProps) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className,
  index = 0,
  variant = "fade-up",
}: {
  children: ReactNode;
  className?: string;
  index?: number;
  variant?: RevealVariant;
}) {
  return (
    <RevealOnScroll delay={index * 0.08} variant={variant} className={cn("h-full", className)}>
      {children}
    </RevealOnScroll>
  );
}
