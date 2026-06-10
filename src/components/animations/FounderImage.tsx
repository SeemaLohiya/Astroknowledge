import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/constants";

interface FounderImageProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showGlow?: boolean;
  showRing?: boolean;
}

const sizes = {
  sm: "w-32 h-40",
  md: "w-48 h-56",
  lg: "w-64 h-72",
  xl: "w-80 h-96",
};

/** Compact expert photo for inner pages (about, admin banners). */
export function FounderImage({ className = "", size = "lg", showGlow = false, showRing = false }: FounderImageProps) {
  return (
    <div className={cn("relative", className)}>
      {showGlow && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/20 to-orange/10 blur-xl" />
      )}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 border-gold/35 shadow-lg shadow-gold/10",
          sizes[size],
          showRing && "ring-2 ring-gold/20 ring-offset-2"
        )}
      >
        <SafeImage
          src={SITE.acharyaImage}
          alt={`${SITE.acharya} - ${SITE.name}`}
          fill
          sizes="(max-width:768px) 200px, 320px"
          className="object-cover object-top"
          priority={size === "xl" || size === "lg"}
        />
      </div>
    </div>
  );
}
