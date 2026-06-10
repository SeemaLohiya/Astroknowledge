"use client";

import { Button } from "@/components/ui/Button";
import { CTA } from "@/lib/constants";
import { useIsAdmin } from "@/lib/use-is-admin";
import { useCartStore } from "@/lib/cart-store";
import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmptyCartModal } from "./EmptyCartModal";

interface BookNowButtonProps {
  label?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onNavigate?: () => void;
}

export function BookNowButton({
  label,
  variant = "secondary",
  size = "sm",
  className,
  onNavigate,
}: BookNowButtonProps) {
  const isAdmin = useIsAdmin();
  const count = useCartStore((s) => s.count());
  const router = useRouter();
  const [showEmpty, setShowEmpty] = useState(false);

  if (isAdmin) {
    return (
      <button
        type="button"
        title="Admin Dashboard"
        onClick={() => {
          onNavigate?.();
          router.push("/admin");
        }}
        className={`inline-flex items-center justify-center rounded-full border border-gold/30 bg-gradient-to-br from-gold/15 to-orange/10 p-2.5 text-gold shadow-sm transition-all hover:scale-105 hover:border-gold/50 hover:shadow-md hover:shadow-gold/20 ${className || ""}`}
      >
        <LayoutDashboard className="h-5 w-5" />
      </button>
    );
  }

  const resolvedLabel = label ?? CTA.proceedToCheckout;

  const handleClick = () => {
    onNavigate?.();
    if (count === 0) {
      setShowEmpty(true);
      return;
    }
    router.push("/cart");
  };

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={handleClick}>
        {resolvedLabel}
      </Button>
      <EmptyCartModal open={showEmpty} onClose={() => setShowEmpty(false)} />
    </>
  );
}
