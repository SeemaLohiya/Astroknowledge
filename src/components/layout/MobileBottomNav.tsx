"use client";

import { useProfile } from "@/components/profile/ProfileGate";
import { useCartStore } from "@/lib/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import { useIsAdmin } from "@/lib/use-is-admin";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { BookOpen, ShoppingBag, Calendar, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/services", icon: Sparkles, labelKey: "services" as const },
  { href: "/courses", icon: BookOpen, labelKey: "courses" as const },
  { href: "/booking", icon: Calendar, labelKey: "book" as const, accent: true },
  { href: "/products", icon: ShoppingBag, labelKey: "shop" as const },
  { href: "/login", icon: User, labelKey: "account" as const },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const cartCount = useCartStore((s) => s.count());
  const { c } = useLanguage();
  const { user } = useProfile();
  const isAdmin = useIsAdmin();

  if (pathname.startsWith("/admin")) return null;

  const labels: Record<string, string> = {
    services: c.offerings.services,
    courses: c.offerings.courses,
    book: c.hero.bookConsultation.split(" ")[0] || "Book",
    shop: c.offerings.products,
    account: c.common.profile,
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gold/15 bg-white/95 md:hidden safe-area-pb">
      <div className="flex items-end justify-around px-1 pt-1.5 pb-2">
        {navItems.map((item) => {
          const accountHref = user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/login";
          const href = item.labelKey === "account" ? accountHref : item.href;
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          const isBook = item.accent;

          return (
            <Link
              key={item.href}
              href={href}
              className={`relative flex flex-col items-center px-2 py-1 transition-transform duration-200 active:scale-95 ${isBook ? "-mt-3" : ""}`}
            >
              <div
                className={`relative flex items-center justify-center rounded-2xl transition-all duration-300 ${
                  isBook
                    ? "h-12 w-12 bg-gradient-to-br from-gold to-gold-bright text-white shadow-lg shadow-gold/30"
                    : `h-9 w-9 ${active ? "bg-gold/15 text-gold scale-105" : "text-text-body"}`
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.href === "/products" && !isAdmin && hydrated && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>
              <span className={`mt-0.5 text-[9px] ${active || isBook ? "font-semibold text-gold" : "text-text-muted"}`}>
                {labels[item.labelKey]}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
