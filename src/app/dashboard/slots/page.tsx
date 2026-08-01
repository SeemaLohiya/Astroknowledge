"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function SlotsRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const service = searchParams.get("service");
    const q = service ? `?tab=book&service=${encodeURIComponent(service)}` : "?tab=book";
    router.replace(`/dashboard/services${q}`);
  }, [router, searchParams]);

  return <p className="py-12 text-center text-text-muted">Redirecting…</p>;
}

export default function DashboardSlotsPage() {
  return (
    <Suspense fallback={<p className="py-12 text-center text-text-muted">Redirecting…</p>}>
      <SlotsRedirect />
    </Suspense>
  );
}
