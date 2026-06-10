"use client";

import { Button } from "@/components/ui/Button";
import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-gold/25 bg-orange/5 px-6 py-16 text-center">
      <PackageOpen className="mb-4 h-12 w-12 text-gold/60" />
      <h3 className="font-display text-xl font-bold text-text-primary">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-text-body">{description}</p>}
      {actionLabel && actionHref && (
        <Button href={actionHref} variant="secondary" size="md" className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
