"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/cn";

interface AnimatedCatalogImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  variant?: "cover" | "contain";
  className?: string;
  frameClassName?: string;
}

/** Catalog card image with shine, float, and hover zoom. */
export function AnimatedCatalogImage({
  src,
  alt,
  fill = true,
  sizes,
  priority,
  variant = "cover",
  className,
  frameClassName,
}: AnimatedCatalogImageProps) {
  return (
    <div className={cn("catalog-img-frame group/img relative min-h-[12rem] overflow-hidden", frameClassName)}>
      <div className="catalog-img-shine pointer-events-none absolute inset-0 z-[2]" />
      <div className="catalog-img-ring pointer-events-none absolute inset-0 z-[1] rounded-[inherit]" />
      <SafeImage
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={cn(
          "catalog-img-animated transition-transform duration-700 ease-out group-hover/img:scale-110",
          variant === "contain" ? "object-contain p-2" : "object-cover object-center",
          className
        )}
      />
    </div>
  );
}
