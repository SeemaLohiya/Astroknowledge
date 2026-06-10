"use client";

import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-orange/10", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl glass-card p-0">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6, cols = "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" }: { count?: number; cols?: string }) {
  return (
    <div className={`grid gap-6 ${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col overflow-hidden rounded-2xl glass-card sm:flex-row">
          <Skeleton className="h-48 w-full shrink-0 rounded-none sm:h-auto sm:w-48" />
          <div className="flex-1 space-y-3 p-6">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="mt-4 h-10 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
