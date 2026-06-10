/** Lightweight CSS aurora — no Framer Motion. */
export function AuroraRays({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="aurora-rays-layer absolute inset-0" />
    </div>
  );
}
