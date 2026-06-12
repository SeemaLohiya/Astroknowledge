"use client";

import { cn } from "@/lib/cn";
import { SITE } from "@/lib/constants";
import { fetchJson } from "@/lib/fetch-json";
import {
  Bell,
  Calendar,
  CreditCard,
  ExternalLink,
  FileText,
  Gift,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLogout } from "@/lib/use-logout";
import { useCallback, useEffect, useState } from "react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview", exact: true },
  { href: "/admin/bookings", icon: Calendar, label: "Bookings" },
  { href: "/admin/orders", icon: Package, label: "Orders" },
  { href: "/admin/payments", icon: CreditCard, label: "Payments" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/vouchers", icon: Gift, label: "Vouchers" },
  { href: "/admin/catalog", icon: Settings, label: "Catalog" },
  { href: "/admin/content", icon: FileText, label: "Content" },
  { href: "/admin/notifications", icon: Bell, label: "Notifications" },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AdminNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href, item.exact);
        return (
          <Link key={item.href} href={item.href} onClick={onNavigate}>
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-gold to-orange font-semibold text-white shadow-md shadow-gold/20"
                  : "text-text-body hover:bg-orange/8 hover:text-gold"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

async function verifyAdmin(retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetchJson<{ user?: { name: string; role: string } | null }>("/api/auth/me", {
      cache: "no-store",
    });
    if (res.ok && res.data?.user?.role === "admin") return { ok: true as const, user: res.data.user };
    if (res.status === 401 || res.status === 403) return { ok: false as const, reason: "auth" as const };
    if (attempt < retries - 1) await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
  }
  return { ok: false as const, reason: "network" as const };
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authState, setAuthState] = useState<"loading" | "ok" | "network-error">("loading");

  const checkAuth = useCallback(async () => {
    const result = await verifyAdmin();
    if (result.ok) {
      setUser(result.user);
      setAuthState("ok");
      return;
    }
    if (result.reason === "auth") {
      router.push("/login?redirect=/admin");
      return;
    }
    setAuthState("network-error");
  }, [router]);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authState !== "ok") return;
    const refresh = () => {
      void fetch("/api/auth/refresh", { method: "POST", cache: "no-store" }).catch(() => {});
    };
    refresh();
    const interval = setInterval(refresh, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [authState]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = useLogout();

  if (authState === "loading") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-text-muted">
        Loading admin panel…
      </div>
    );
  }

  if (authState === "network-error") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-text-primary font-semibold">Connection interrupted</p>
        <p className="mt-2 text-sm text-text-muted">The server may be waking up. Your session is still valid.</p>
        <button
          type="button"
          onClick={() => {
            setAuthState("loading");
            void checkAuth();
          }}
          className="mt-6 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-gold/20 bg-gradient-to-r from-gold/10 via-orange/5 to-cream px-4 py-3 lg:hidden">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Admin Panel</p>
          <p className="text-sm font-semibold text-text-primary">{user?.name || SITE.acharya}</p>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl border border-gold/25 bg-white p-2 text-gold"
          aria-label="Toggle admin menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mb-6 rounded-2xl border border-gold/20 bg-cream/95 p-4 shadow-lg lg:hidden">
          <AdminNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          <button
            onClick={() => void handleLogout()}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-500 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
          <Link
            href="/"
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-text-body hover:bg-orange/5"
            onClick={() => setMobileOpen(false)}
          >
            <ExternalLink className="h-4 w-4" />
            View website
          </Link>
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 overflow-hidden rounded-2xl border border-gold/20 bg-cream/90 shadow-sm">
            <div className="border-b border-gold/15 bg-gradient-to-br from-gold/12 to-orange/8 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gold">Admin Panel</p>
              <p className="mt-1 font-semibold text-text-primary">{user?.name || SITE.acharya}</p>
              <p className="mt-1 text-xs text-text-muted">Manage bookings, catalog & users</p>
            </div>
            <div className="p-4">
              <AdminNav pathname={pathname} />
              <div className="mt-4 space-y-1 border-t border-gold/15 pt-4">
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-text-body transition-colors hover:bg-orange/5 hover:text-gold"
                >
                  <ExternalLink className="h-4 w-4" />
                  View website
                </Link>
                <button
                  onClick={() => void handleLogout()}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
