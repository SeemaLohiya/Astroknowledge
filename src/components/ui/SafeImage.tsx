"use client";

import { cn } from "@/lib/cn";
import Image from "next/image";
import { useState } from "react";

const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zz48cmVjdCB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIGZpbGw9JyNmNWYwZTAnLz48L3N2Zz4=";

const FALLBACK = "/images/products/p1.jpg";

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

function useNativeImg(src: string) {
  return (
    src.startsWith("/api/media/") ||
    src.startsWith("data:") ||
    src.endsWith(".svg") ||
    src.startsWith("blob:")
  );
}

export function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
  loading,
  quality = 65,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = !src || failed ? FALLBACK : src;
  const native = useNativeImg(resolved) || failed;

  if (native) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolved}
          alt={alt}
          loading={priority ? "eager" : loading ?? "lazy"}
          decoding="async"
          onError={() => {
            if (!failed && resolved !== FALLBACK) setFailed(true);
          }}
          className={cn("absolute inset-0 h-full w-full object-cover", className)}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={alt}
        width={width || 400}
        height={height || 400}
        loading={loading ?? "lazy"}
        decoding="async"
        onError={() => {
          if (!failed && resolved !== FALLBACK) setFailed(true);
        }}
        className={className}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={resolved}
        alt={alt}
        fill
        sizes={sizes || "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
        className={className}
        priority={priority}
        quality={quality}
        placeholder="blur"
        blurDataURL={BLUR_PLACEHOLDER}
        loading={priority ? undefined : loading ?? "lazy"}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      width={width || 400}
      height={height || 400}
      className={className}
      priority={priority}
      quality={quality}
      placeholder="blur"
      blurDataURL={BLUR_PLACEHOLDER}
      loading={priority ? undefined : loading ?? "lazy"}
      onError={() => setFailed(true)}
    />
  );
}
