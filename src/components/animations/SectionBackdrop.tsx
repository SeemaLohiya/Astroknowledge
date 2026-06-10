/** Lightweight CSS-only section background — no JS animation overhead. */
export function SectionBackdrop({ variant }: { variant?: "warm" | "soft" | "cosmic" } = {}) {
  void variant;
  return (
    <>
      <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gold/10 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-orange/10 blur-2xl" />
    </>
  );
}
