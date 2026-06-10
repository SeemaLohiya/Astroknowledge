"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { fetchJson } from "@/lib/fetch-json";
import { AdminNotification } from "@/lib/types";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  useEffect(() => {
    void fetchJson<{ notifications?: AdminNotification[] }>("/api/notifications").then((d) => {
      setNotifications(d.data?.notifications || []);
    });
  }, []);

  return (
    <PageTransition>
      <FadeIn className="mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary flex items-center gap-2">
          <Bell className="h-7 w-7 text-gold" /> Notifications <span className="text-gradient-gold">Log</span>
        </h1>
        <p className="text-sm text-text-muted">System actions and WhatsApp-ready confirmations</p>
      </FadeIn>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <p className="text-text-muted text-center py-12">No notifications yet</p>
        ) : notifications.map((n, i) => (
          <FadeIn key={n.id} delay={i * 0.02}>
            <div className="rounded-xl glass-card p-4 flex flex-wrap justify-between gap-2">
              <div>
                <p className="text-sm text-text-primary">{n.message}</p>
                <p className="text-xs text-text-muted mt-1">
                  {n.type.replace(/_/g, " ")} · {n.channel} · {new Date(n.createdAt).toLocaleString("en-IN")}
                  {n.referenceId && ` · Ref: ${n.referenceId}`}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full h-fit ${n.channel === "whatsapp" ? "bg-green-500/15 text-green-700" : "bg-gold/10 text-gold"}`}>
                {n.channel}
              </span>
            </div>
          </FadeIn>
        ))}
      </div>
    </PageTransition>
  );
}
