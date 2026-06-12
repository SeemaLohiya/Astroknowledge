"use client";

import { DashboardBirthGate } from "@/components/profile/DashboardBirthGate";
import { ProfileDetailsModalProvider } from "@/components/profile/ProfileDetailsModal";
import { cn } from "@/lib/cn";
import { fetchJson } from "@/lib/fetch-json";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { motion } from "framer-motion";
import { Calendar, Clock, Gift, LayoutDashboard, LogOut, Package, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { c } = useLanguage();
  const d = c.dashboard;
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const navItems = useMemo(() => [
    { href: "/dashboard", icon: LayoutDashboard, label: d.overview },
    { href: "/dashboard/purchases", icon: Package, label: d.purchases },
    { href: "/dashboard/vouchers", icon: Gift, label: "Vouchers" },
    { href: "/dashboard/bookings", icon: Calendar, label: d.yourBookings },
    { href: "/dashboard/slots", icon: Clock, label: d.bookConsultation },
    { href: "/dashboard/profile", icon: User, label: c.common.profile },
  ], [c, d]);

  useEffect(() => {
    void fetchJson<{ user?: { name: string; email: string; role: string } | null }>("/api/auth/me").then((res) => {
      if (!res.data?.user) { router.push("/login"); return; }
      if (res.data.user.role === "admin") { router.push("/admin"); return; }
      setUser(res.data.user);
    });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
      <aside className="hidden w-64 shrink-0 md:block">
        <div className="sticky top-24 rounded-2xl glass-card p-6">
          {user && (
            <div className="mb-6 border-b border-white/10 pb-4">
              <p className="font-semibold text-text-primary">{user.name}</p>
              <p className="text-xs text-text-muted">{user.email}</p>
            </div>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors",
                    pathname === item.href || (item.href === "/dashboard/purchases" && pathname === "/dashboard/orders")
                      ? "bg-gold/20 text-gold"
                      : "text-text-body hover:bg-orange/5 hover:text-text-primary"
                  )}
                  whileHover={{ x: 4 }}
                >
                  <item.icon className="h-4 w-4" />{item.label}
                </motion.div>
              </Link>
            ))}
            <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 hover:bg-red-400/10">
              <LogOut className="h-4 w-4" />{c.common.logout}
            </button>
          </nav>
        </div>
      </aside>
      <div className="flex-1">
        <ProfileDetailsModalProvider>
          <DashboardBirthGate>{children}</DashboardBirthGate>
        </ProfileDetailsModalProvider>
      </div>
    </div>
  );
}
