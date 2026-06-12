"use client";

import { cn } from "@/lib/cn";
import Image from "next/image";

const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zz48cmVjdCB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIGZpbGw9JyNmNWYwZTAnLz48L3N2Zz4=";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  quality?: number;
}

export function SafeImage({ src, alt, fill, width, height, className, sizes, priority, loading, quality = 72 }: SafeImageProps) {
  const isSvg = src.endsWith(".svg");

  if (isSvg) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading={priority ? "eager" : loading ?? "lazy"} decoding="async" className={cn("absolute inset-0 h-full w-full object-cover", className)} />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} width={width} height={height} loading={loading ?? "lazy"} decoding="async" className={className} />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes || "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
        className={className}
        priority={priority}
        quality={quality}
        placeholder="blur"
        blurDataURL={BLUR_PLACEHOLDER}
        loading={priority ? undefined : loading ?? "lazy"}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 400}
      height={height || 400}
      className={className}
      priority={priority}
      quality={quality}
      placeholder="blur"
      blurDataURL={BLUR_PLACEHOLDER}
      loading={priority ? undefined : loading ?? "lazy"}
    />
  );
}
