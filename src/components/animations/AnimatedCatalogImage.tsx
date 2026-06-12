"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";

interface AnimatedCatalogImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  index?: number;
  variant?: "cover" | "contain";
  className?: string;
  frameClassName?: string;
}

/** Catalog card image — lightweight on mobile, priority for first visible items. */
export function AnimatedCatalogImage({
  src,
  alt,
  fill = true,
  sizes,
  priority,
  index = 99,
  variant = "cover",
  className,
  frameClassName,
}: AnimatedCatalogImageProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const eager = priority ?? index < 3;
  const quality = isMobile ? 58 : 68;

  return (
    <div className={cn("catalog-img-frame group/img relative min-h-[12rem] overflow-hidden bg-orange/[0.04]", frameClassName)}>
      <div className="catalog-img-shine pointer-events-none absolute inset-0 z-[2] hidden sm:block" />
      <SafeImage
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes || "(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 240px"}
        priority={eager}
        quality={quality}
        className={cn(
          "catalog-img-animated sm:transition-transform sm:duration-500 sm:ease-out sm:group-hover/img:scale-105",
          variant === "contain" ? "object-contain p-2" : "object-cover object-center",
          className
        )}
      />
    </div>
  );
}
