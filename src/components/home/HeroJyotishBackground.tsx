"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";

type TileShape = "circle" | "diamond" | "arch" | "hex" | "soft";

type JyotishTile = {
  id: string;
  src: string;
  alt: string;
  className: string;
  shape: TileShape;
  depth: number;
  parallax: number;
  layer: "far" | "mid" | "near";
  delay: string;
  holo?: boolean;
  mobile?: boolean;
};

/** Hero background — certifications, courses & core Jyotish services only. */
const JYOTISH_TILES: JyotishTile[] = [
  {
    id: "vedic-cert",
    src: "/images/courses/vedic-astrology-course.jpg",
    alt: "Astrology Course",
    className: "left-[0%] top-[5%] h-[30%] w-[26%]",
    shape: "arch",
    depth: -180,
    parallax: 28,
    layer: "far",
    delay: "0s",
    holo: true,
    mobile: true,
  },
  {
    id: "kundali-vishleshan",
    src: "/images/ref/services/kundali-vishleshan.png",
    alt: "Kundali Vishleshan — Horoscope Reading",
    className: "left-[18%] top-[2%] h-[18%] w-[16%] hidden sm:block",
    shape: "hex",
    depth: -150,
    parallax: 24,
    layer: "far",
    delay: "0.3s",
    mobile: true,
  },
  {
    id: "numerology-mastery",
    src: "/images/courses/numerology-course.jpg",
    alt: "Numerology Mastery",
    className: "right-[1%] top-[3%] h-[24%] w-[24%]",
    shape: "circle",
    depth: -160,
    parallax: 32,
    layer: "far",
    delay: "0.5s",
    mobile: true,
  },
  {
    id: "ritual-specialist",
    src: "/images/courses/ritual-specialist-course.jpg",
    alt: "Ritual Specialist Course",
    className: "right-[6%] top-[32%] h-[22%] w-[20%]",
    shape: "soft",
    depth: 0,
    parallax: 48,
    layer: "mid",
    delay: "0.2s",
  },
  {
    id: "vastu-fundamentals",
    src: "/images/courses/vastu-course.jpg",
    alt: "Vastu Shastra Fundamentals",
    className: "left-[2%] bottom-[10%] h-[24%] w-[22%]",
    shape: "diamond",
    depth: -30,
    parallax: 42,
    layer: "mid",
    delay: "0.6s",
    mobile: true,
  },
  {
    id: "kundli-milan",
    src: "/images/ref/services/kundli-milan.png",
    alt: "Kundli Milan — Match Making",
    className: "right-[1%] bottom-[12%] h-[24%] w-[22%]",
    shape: "soft",
    depth: 10,
    parallax: 45,
    layer: "mid",
    delay: "0.8s",
    holo: true,
    mobile: true,
  },
  {
    id: "vastu-consultancy",
    src: "/images/ref/services/vastu.png",
    alt: "Vastu Consultancy",
    className: "left-[8%] top-[38%] h-[20%] w-[18%] hidden md:block",
    shape: "hex",
    depth: 90,
    parallax: 58,
    layer: "near",
    delay: "0.4s",
    mobile: true,
  },
];

const LAYER_ORDER: JyotishTile["layer"][] = ["far", "mid", "near"];

export function HeroJyotishBackground() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);


  const visibleTiles = isMobile
    ? JYOTISH_TILES.filter((t) => t.mobile).slice(0, 3)
    : JYOTISH_TILES.filter((t) => t.mobile || t.layer !== "far");

  return (
    <div
      ref={sceneRef}
      className="hero-3d-scene pointer-events-none absolute inset-0 overflow-hidden"
      style={{ "--mx": 0, "--my": 0 } as CSSProperties}
      aria-hidden
    >
      <div className="hero-3d-vortex absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2" />
      {!isMobile && (
        <>
          <div className="hero-3d-nebula hero-3d-nebula-a absolute left-[10%] top-[20%] h-64 w-64 rounded-full" />
          <div className="hero-3d-nebula hero-3d-nebula-b absolute right-[8%] bottom-[15%] h-80 w-80 rounded-full" />
        </>
      )}

      <div className="hero-3d-stage">
        {!isMobile && (
          <>
            <div className="hero-3d-mandala-ring hero-3d-mandala-outer" />
            <div className="hero-3d-mandala-ring hero-3d-mandala-inner" />
          </>
        )}

        {LAYER_ORDER.map((layer) => (
          <div key={layer} className={`hero-3d-layer hero-3d-layer-${layer}`}>
            {visibleTiles.filter((t) => t.layer === layer).map((tile) => (
              <div
                key={tile.id}
                className={`hero-3d-tile ${tile.holo ? "hero-3d-tile-holo" : ""} absolute ${tile.className}`}
                style={
                  {
                    "--z": `${tile.depth}px`,
                    "--px": tile.parallax,
                    "--delay": tile.delay,
                  } as CSSProperties
                }
              >
                <div className={`hero-3d-tile-inner hero-shape-${tile.shape}`}>
                  <div className="hero-3d-tile-face hero-3d-tile-front">
                    <SafeImage
                      src={tile.src}
                      alt={tile.alt}
                      fill
                      sizes={isMobile ? "30vw" : "(max-width:768px) 28vw, 260px"}
                      quality={isMobile ? 48 : 60}
                      className="hero-bg-tile-img object-cover"
                      loading="lazy"
                    />
                    <div className="hero-bg-tile-wash" />
                    {!isMobile && <div className="hero-bg-tile-shine" />}
                    <div className="hero-3d-tile-edge" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {!isMobile && (
          <>
            <div className="hero-3d-orbit hero-3d-orbit-1" />
            <div className="hero-3d-orbit hero-3d-orbit-2" />
          </>
        )}
      </div>

      {!isMobile && <div className="hero-bg-stars absolute inset-0 opacity-50" />}
      {!isMobile && <div className="hero-3d-rays absolute inset-0" />}

      <div className="hero-3d-wash absolute inset-0 bg-gradient-to-r from-bg-deep/95 via-bg-deep/70 to-bg-deep/88" />
      <div className="hero-3d-wash absolute inset-0 bg-[radial-gradient(ellipse_52%_62%_at_28%_44%,rgba(255,251,245,0.93),transparent)]" />
      <div className="hero-3d-wash absolute inset-0 bg-[radial-gradient(ellipse_40%_48%_at_78%_50%,rgba(255,248,240,0.7),transparent)]" />

      {!isMobile && <div className="absolute inset-0 bg-aurora opacity-30 animate-aurora" />}
      {!isMobile && <div className="hero-bg-beam absolute inset-0" />}
    </div>
  );
}
