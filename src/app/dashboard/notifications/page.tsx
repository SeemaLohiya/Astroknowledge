"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { fetchJson } from "@/lib/fetch-json";
import { AdminNotification } from "@/lib/types";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardNotificationsPage() {
  const [items, setItems] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchJson<{ notifications?: AdminNotification[] }>("/api/notifications?mine=1", {
      cache: "no-store",
    }).then((res) => {
      setItems(res.data?.notifications || []);
      setLoading(false);
    });
  }, []);

  return (
    <PageTransition>
      <FadeIn>
        <h1 className="mb-2 font-display text-2xl font-bold text-text-primary">
          My <span className="text-gradient-gold">Notifications</span>
        </h1>
        <p className="mb-6 text-sm text-text-muted">Updates about payments, bookings, and orders</p>
      </FadeIn>

      {loading ? (
        <p className="py-12 text-center text-text-muted">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl glass-card p-12 text-center">
          <Bell className="mx-auto mb-4 h-12 w-12 text-text-muted" />
          <p className="text-text-body">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n, i) => (
            <FadeIn key={n.id} delay={i * 0.02}>
              <div className="rounded-xl border border-gold/15 bg-white/80 px-4 py-3">
                <p className="text-sm text-text-primary">{n.message}</p>
                <p className="mt-1 text-[11px] text-text-muted">
                  {new Date(n.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
