"use client";

import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { PageTransition } from "@/components/animations/PageTransition";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { fetchJson } from "@/lib/fetch-json";
import { BookingSlot, Order } from "@/lib/types";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CreditCard,
  IndianRupee,
  Package,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const NO_STORE = { cache: "no-store" as RequestCache };

interface Analytics {
  revenue: number;
  paidCount: number;
  pendingPayments: number;
  pendingBookings: number;
  totalOrders: number;
  totalUsers: number;
  newUsersThisMonth: number;
  avgOrderValue: number;
  conversionRate: number;
  topItems: { name: string; count: number }[];
  methodRevenue: { razorpay: number; admin_approval: number };
  methodCounts: { razorpay: number; admin_approval: number };
  categoryRevenue: Record<string, number>;
  categoryCounts: Record<string, number>;
  monthlyRevenue: { month: string; amount: number }[];
  bookingStats: { total: number; pending: number; confirmed: number; completed: number };
  recentRevenue: { id: string; userName: string; amount: number; method?: string; createdAt: string }[];
}

const QUICK_LINKS = [
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/payments", label: "Payments", icon: IndianRupee },
  { href: "/admin/catalog", label: "Catalog", icon: Package },
  { href: "/admin/users", label: "Users", icon: Users },
];

const CATEGORY_LABELS: Record<string, string> = {
  product: "Products",
  service: "Services",
  course: "Courses",
  pooja: "Pooja",
  healing: "Healing",
};

function BarChart({ data, maxValue }: { data: { label: string; value: number }[]; maxValue: number }) {
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t-lg bg-gradient-to-t from-gold to-orange transition-all duration-500"
            style={{ height: `${maxValue > 0 ? Math.max(8, (d.value / maxValue) * 100) : 8}%` }}
          />
          <span className="text-[10px] text-text-muted">{d.label}</span>
          {d.value > 0 && <span className="text-[9px] font-medium text-gold">₹{(d.value / 1000).toFixed(0)}k</span>}
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingSlot[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    const [statsRes, slotsRes, ordersRes] = await Promise.all([
      fetchJson<Analytics>("/api/admin/analytics", NO_STORE),
      fetchJson<{ slots?: BookingSlot[] }>("/api/slots", NO_STORE),
      fetchJson<{ orders?: Order[] }>("/api/orders", NO_STORE),
    ]);

    if (statsRes.ok && statsRes.data) {
      setAnalytics(statsRes.data);
      setError(null);
    } else if (!statsRes.ok) {
      setError(statsRes.error || "Could not load analytics");
    }

    const slots = slotsRes.data?.slots || [];
    const active = slots
      .filter((s) => s.status === "booked" || s.status === "pending")
      .sort((a, b) => (b.bookedAt || b.createdAt).localeCompare(a.bookedAt || a.createdAt))
      .slice(0, 5);
    setRecentBookings(active);

    const orders = (ordersRes.data?.orders || [])
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5);
    setRecentOrders(orders);
    setLastUpdated(new Date());
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void load(true);
    const interval = setInterval(() => void load(true), 30000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void load(true);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  const maxMonthly = analytics ? Math.max(...analytics.monthlyRevenue.map((m) => m.amount), 1) : 1;
  const maxCategory = analytics
    ? Math.max(...Object.values(analytics.categoryRevenue), 1)
    : 1;

  const cards = analytics
    ? [
        { icon: IndianRupee, label: "Total Revenue", value: analytics.revenue, color: "from-gold to-gold-bright", format: true, href: "/admin/payments" },
        { icon: Package, label: "Orders", value: analytics.totalOrders, color: "from-gold-dark to-gold", href: "/admin/orders" },
        { icon: Users, label: "Users", value: analytics.totalUsers, sub: `+${analytics.newUsersThisMonth} this month`, color: "from-gold to-orange", href: "/admin/users" },
        { icon: TrendingUp, label: "Avg Order", value: analytics.avgOrderValue, color: "from-orange to-gold", format: true, href: "/admin/orders" },
      ]
    : [];

  return (
    <PageTransition>
      <RevealOnScroll variant="blur-up" className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
              Business <span className="text-gradient-gold">Analytics</span>
            </h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-text-body">
              <BarChart3 className="h-4 w-4 text-gold" />
              Revenue, users, products & bookings overview
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void load()}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-full border border-gold/25 bg-white px-3 py-1 text-xs font-semibold text-gold hover:bg-gold/10 disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <p className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
              {analytics ? `${analytics.conversionRate}% conversion` : "Loading…"}
            </p>
            {lastUpdated && (
              <p className="text-[10px] text-text-muted">
                Updated {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>
        </div>
      </RevealOnScroll>

      {error && (
        <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {analytics && analytics.revenue === 0 && analytics.paidCount === 0 && (
        <RevealOnScroll className="mb-6">
          <div className="rounded-2xl border border-gold/20 bg-white/80 px-5 py-4 text-sm text-text-body">
            No verified payments yet — revenue and charts reflect only <strong>paid</strong> Razorpay or admin-approved transactions.
          </div>
        </RevealOnScroll>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <RevealOnScroll key={card.label} delay={i * 0.08} variant="fade-up">
            <Link href={card.href} className="block">
              <div className={`rounded-2xl bg-gradient-to-br ${card.color} p-6 text-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg`}>
                <card.icon className="mb-3 h-8 w-8 opacity-80" />
                <p className="text-3xl font-bold">
                  {card.format ? (
                    <>₹<AnimatedCounter value={card.value} /></>
                  ) : (
                    <AnimatedCounter value={card.value} />
                  )}
                </p>
                <p className="text-sm opacity-90">{card.label}</p>
                {"sub" in card && card.sub && <p className="mt-1 text-xs opacity-75">{card.sub}</p>}
              </div>
            </Link>
          </RevealOnScroll>
        ))}
      </div>

      {analytics && (
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <RevealOnScroll variant="fade-left">
            <div className="rounded-2xl border border-gold/15 bg-white/80 p-6">
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-text-primary">
                <BarChart3 className="h-5 w-5 text-gold" />
                Monthly Revenue (6 months)
              </h2>
              <BarChart
                data={analytics.monthlyRevenue.map((m) => ({ label: m.month, value: m.amount }))}
                maxValue={maxMonthly}
              />
            </div>
          </RevealOnScroll>

          <RevealOnScroll variant="fade-right">
            <div className="rounded-2xl border border-gold/15 bg-white/80 p-6">
              <h2 className="mb-4 font-semibold text-text-primary">Revenue by Category</h2>
              <div className="space-y-3">
                {Object.entries(analytics.categoryRevenue).map(([cat, amount]) => (
                  <div key={cat}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-text-primary">{CATEGORY_LABELS[cat] || cat}</span>
                      <span className="font-medium text-gold">₹{amount.toLocaleString("en-IN")} · {analytics.categoryCounts[cat] || 0} sold</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-orange/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold to-orange transition-all duration-500"
                        style={{ width: `${(amount / maxCategory) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll variant="fade-up">
            <div className="rounded-2xl border border-gold/15 bg-white/80 p-6">
              <h2 className="mb-4 font-semibold text-text-primary">Payment Methods</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gold/15 bg-gradient-to-br from-gold/10 to-orange/5 p-4">
                  <div className="flex items-center gap-2 text-gold">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-semibold">Razorpay</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-text-primary">₹{analytics.methodRevenue.razorpay.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-text-muted">{analytics.methodCounts.razorpay} transactions</p>
                </div>
                <div className="rounded-xl border border-gold/15 bg-gradient-to-br from-orange/10 to-gold/5 p-4">
                  <div className="flex items-center gap-2 text-gold">
                    <ShieldCheck className="h-5 w-5" />
                    <span className="font-semibold">Admin Verified</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-text-primary">₹{analytics.methodRevenue.admin_approval.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-text-muted">{analytics.methodCounts.admin_approval} transactions</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll variant="fade-up">
            <div className="rounded-2xl border border-gold/15 bg-white/80 p-6">
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-text-primary">
                <Calendar className="h-5 w-5 text-gold" />
                Booking Overview
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total", value: analytics.bookingStats.total },
                  { label: "Pending", value: analytics.bookingStats.pending },
                  { label: "Confirmed", value: analytics.bookingStats.confirmed },
                  { label: "Completed", value: analytics.bookingStats.completed },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-orange/5 px-4 py-3 text-center">
                    <p className="text-2xl font-bold text-text-primary">{s.value}</p>
                    <p className="text-xs text-text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
              <Link href="/admin/bookings" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold hover:underline">
                Manage bookings <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      )}

      <RevealOnScroll className="mb-8">
        <div className="rounded-2xl border border-gold/15 bg-white/80 p-5">
          <h2 className="mb-4 font-semibold text-text-primary">Quick actions</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-xl border border-gold/15 px-3 py-2.5 text-sm font-medium text-text-body transition-all hover:border-gold/40 hover:bg-gold/5 hover:text-gold"
              >
                <link.icon className="h-4 w-4 text-gold" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </RevealOnScroll>

      {analytics && analytics.topItems.length > 0 && (
        <RevealOnScroll className="mb-8 rounded-2xl border border-gold/15 bg-white/80 p-6">
          <h2 className="mb-4 font-semibold text-text-primary">Top selling items</h2>
          {analytics.topItems.map((item, i) => (
            <div key={item.name} className="flex justify-between border-b border-gold/10 py-2 text-sm last:border-0">
              <span className="text-text-primary">
                <span className="mr-2 text-gold font-bold">#{i + 1}</span>
                {item.name}
              </span>
              <span className="font-medium text-gold">{item.count} sold</span>
            </div>
          ))}
        </RevealOnScroll>
      )}

      {analytics && analytics.recentRevenue.length > 0 && (
        <RevealOnScroll className="mb-8 rounded-2xl border border-gold/15 bg-white/80 p-6">
          <h2 className="mb-4 font-semibold text-text-primary">Recent payments</h2>
          {analytics.recentRevenue.map((r) => (
            <div key={r.id} className="flex justify-between border-b border-gold/10 py-2 text-sm last:border-0">
              <div>
                <p className="text-text-primary">{r.userName}</p>
                <p className="text-xs text-text-muted capitalize">{r.method?.replace("_", " ") || "—"} · {new Date(r.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
              <span className="font-bold text-gold">₹{r.amount.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </RevealOnScroll>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <RevealOnScroll delay={0.1} variant="fade-left">
          <div className="rounded-2xl border border-gold/15 bg-white/80 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold text-text-primary">
                <Calendar className="h-5 w-5 text-gold" />
                Recent Bookings
              </h2>
              <Link href="/admin/bookings" className="text-xs font-semibold text-gold hover:underline">View all</Link>
            </div>
            {recentBookings.length === 0 ? (
              <p className="text-sm text-text-muted">No active bookings</p>
            ) : (
              recentBookings.map((b) => (
                <div key={b.id} className="flex justify-between border-b border-gold/10 py-3 text-sm last:border-0">
                  <div>
                    <p className="text-text-primary">{b.serviceName || "Consultation"}</p>
                    <p className="text-text-muted">{b.userName} — {b.date} {b.time}</p>
                  </div>
                  <span className="text-xs capitalize text-gold">{b.status}</span>
                </div>
              ))
            )}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15} variant="fade-right">
          <div className="rounded-2xl border border-gold/15 bg-white/80 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-text-primary">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs font-semibold text-gold hover:underline">View all</Link>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-text-muted">No orders yet</p>
            ) : (
              recentOrders.map((o) => (
                <div key={o.id} className="flex justify-between border-b border-gold/10 py-3 text-sm last:border-0">
                  <div>
                    <p className="text-text-primary">{o.items.map((i) => i.name).join(", ")}</p>
                    <p className="text-text-muted">{o.userName} — ₹{o.total.toLocaleString("en-IN")}</p>
                  </div>
                  <span className="text-xs capitalize text-gold">{o.status}</span>
                </div>
              ))
            )}
          </div>
        </RevealOnScroll>
      </div>
    </PageTransition>
  );
}
