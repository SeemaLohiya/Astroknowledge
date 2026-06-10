"use client";

const PARTICLES = [
  { x: 12, y: 18, size: 3, duration: 12, delay: 0 },
  { x: 28, y: 45, size: 2, duration: 14, delay: 1 },
  { x: 55, y: 12, size: 4, duration: 11, delay: 0.5 },
  { x: 72, y: 38, size: 2, duration: 16, delay: 2 },
  { x: 88, y: 65, size: 3, duration: 13, delay: 1.5 },
  { x: 15, y: 72, size: 2, duration: 15, delay: 3 },
  { x: 42, y: 85, size: 3, duration: 10, delay: 0.8 },
  { x: 65, y: 55, size: 2, duration: 17, delay: 2.5 },
  { x: 35, y: 30, size: 4, duration: 12, delay: 1.2 },
  { x: 80, y: 22, size: 2, duration: 14, delay: 0.3 },
  { x: 5, y: 50, size: 3, duration: 11, delay: 2 },
  { x: 50, y: 68, size: 2, duration: 16, delay: 1.8 },
  { x: 92, y: 40, size: 3, duration: 13, delay: 0.6 },
  { x: 22, y: 90, size: 2, duration: 15, delay: 2.2 },
  { x: 58, y: 8, size: 4, duration: 10, delay: 1 },
  { x: 75, y: 78, size: 2, duration: 14, delay: 3.5 },
  { x: 38, y: 58, size: 3, duration: 12, delay: 0.9 },
  { x: 8, y: 35, size: 2, duration: 16, delay: 2.8 },
  { x: 68, y: 92, size: 3, duration: 11, delay: 1.4 },
  { x: 48, y: 42, size: 2, duration: 15, delay: 0.4 },
];

export function FloatingParticles({ count = 20 }: { count?: number }) {
  const visible = PARTICLES.slice(0, count);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {visible.map((p) => (
        <span
          key={`${p.x}-${p.y}`}
          className="absolute rounded-full bg-gold/40 animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
