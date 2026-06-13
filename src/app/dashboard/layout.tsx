"use client";

import { DashboardBirthGate } from "@/components/profile/DashboardBirthGate";
import { ProfileDetailsModalProvider } from "@/components/profile/ProfileDetailsModal";
import { useProfile } from "@/components/profile/ProfileGate";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useLogout } from "@/lib/use-logout";
import { motion } from "framer-motion";
import { Calendar, Clock, Gift, LayoutDashboard, LogOut, Package, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { c } = useLanguage();
  const d = c.dashboard;
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = useLogout();
  const { user, loading, authReady } = useProfile();

  const navItems = useMemo(() => [
    { href: "/dashboard", icon: LayoutDashboard, label: d.overview },
    { href: "/dashboard/purchases", icon: Package, label: d.purchases },
    { href: "/dashboard/vouchers", icon: Gift, label: "Vouchers" },
    { href: "/dashboard/bookings", icon: Calendar, label: d.yourBookings },
    { href: "/dashboard/slots", icon: Clock, label: d.bookConsultation },
    { href: "/dashboard/profile", icon: User, label: c.common.profile },
  ], [c, d]);

  const isActive = (href: string) =>
    pathname === href ||
    (href === "/dashboard/purchases" && pathname === "/dashboard/orders") ||
    (href === "/dashboard/profile" && pathname === "/dashboard/kundli");

  useEffect(() => {
    if (!authReady) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user.role === "admin") {
      router.replace("/admin");
    }
  }, [user, authReady, router, pathname]);

  if (!authReady || loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
      </div>
    );
  }

  if (!user || user.role === "admin") return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <div className="mb-4 md:hidden">
        <div className="mb-3 rounded-xl border border-gold/15 bg-white/80 px-4 py-3">
          <p className="font-semibold text-text-primary">{user.name}</p>
          <p className="text-xs text-text-muted">{user.email}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-colors",
                  active ? "bg-gold text-white" : "border border-gold/20 bg-white text-text-body"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600"
          >
            <LogOut className="h-3.5 w-3.5" />
            {c.common.logout}
          </button>
        </nav>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-24 rounded-2xl glass-card p-6">
            <div className="mb-6 border-b border-white/10 pb-4">
              <p className="font-semibold text-text-primary">{user.name}</p>
              <p className="text-xs text-text-muted">{user.email}</p>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors",
                      isActive(item.href)
                        ? "bg-gold/20 text-gold"
                        : "text-text-body hover:bg-orange/5 hover:text-text-primary"
                    )}
                    whileHover={{ x: 4 }}
                  >
                    <item.icon className="h-4 w-4" />{item.label}
                  </motion.div>
                </Link>
              ))}
              <button onClick={() => void handleLogout()} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 hover:bg-red-400/10">
                <LogOut className="h-4 w-4" />{c.common.logout}
              </button>
            </nav>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <ProfileDetailsModalProvider>
            <DashboardBirthGate>{children}</DashboardBirthGate>
          </ProfileDetailsModalProvider>
        </div>
      </div>
    </div>
  );
}
