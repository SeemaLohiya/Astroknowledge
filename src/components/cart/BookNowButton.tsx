"use client";

import { Button } from "@/components/ui/Button";
import { CTA } from "@/lib/constants";
import { useIsAdmin } from "@/lib/use-is-admin";
import { useCartStore } from "@/lib/cart-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmptyCartModal } from "./EmptyCartModal";
import Link from "next/link";

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
      <Link
        href="/admin"
        onClick={() => onNavigate?.()}
        className={`hidden text-sm font-semibold text-gold hover:underline lg:inline-flex ${className || ""}`}
      >
        Admin Dashboard
      </Link>
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
