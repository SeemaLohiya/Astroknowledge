"use client";

import { getNavDropdowns } from "@/lib/i18n/nav-i18n";
import { cn } from "@/lib/cn";
import { useProfile } from "@/components/profile/ProfileGate";
import { useCartStore } from "@/lib/cart-store";
import { useIsAdmin } from "@/lib/use-is-admin";
import { useHydrated } from "@/lib/use-hydrated";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedProfileButton } from "./AnimatedProfileButton";
import { Menu, X, ShoppingCart } from "lucide-react";
import { PromoBanner } from "./PromoBanner";
import { SiteLogo } from "@/components/ui/SiteLogo";
import { NavDropdownMenu } from "./NavDropdownMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookNowButton } from "@/components/cart/BookNowButton";
import { Button } from "../ui/Button";
import { LanguageToggle } from "./LanguageToggle";

const DIRECT_LINKS = [
  { href: "/pooja", key: "pooja" as const },
  { href: "/about", key: "about" as const },
  { href: "/contact", key: "contact" as const },
] as const;

const HIGHLIGHT_NAV_KEYS = new Set(["pooja", "about", "contact"]);

function highlightNavClass(key: string, active: boolean) {
  if (!HIGHLIGHT_NAV_KEYS.has(key)) return "";
  return cn(
    "nav-highlight-link relative font-semibold",
    active
      ? "text-white bg-gradient-to-r from-gold to-orange shadow-md shadow-gold/25"
      : "text-gold bg-gradient-to-r from-gold/12 to-orange/10 border border-gold/30 hover:from-gold hover:to-orange hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-gold/20"
  );
}

export function Header() {
  const { t, c, lang } = useLanguage();
  const navDropdowns = getNavDropdowns(lang);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useProfile();
  const isAdmin = useIsAdmin();
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const hydrated = useHydrated();
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {!isAdminRoute && <PromoBanner />}

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled ? "bg-white/98 shadow-lg shadow-orange/10 border-b border-gold/15" : "bg-cream/95"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="group shrink-0">
            <SiteLogo size="sm" tagline={c.common.vedicWisdom} className="group-hover:[&_span]:text-gold transition-colors" />
          </Link>

          <nav className="hidden xl:flex items-center gap-0.5">
            {navDropdowns.map((dropdown) => (
              <NavDropdownMenu
                key={dropdown.href}
                dropdown={dropdown}
                viewAllLabel={c.viewAllNav}
                pathname={pathname}
              />
            ))}

            {DIRECT_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-2.5 py-2 text-sm rounded-lg transition-all duration-300",
                    HIGHLIGHT_NAV_KEYS.has(link.key)
                      ? highlightNavClass(link.key, active)
                      : active
                        ? "text-gold font-semibold bg-gold/8"
                        : "text-text-body hover:text-gold hover:bg-orange/5"
                  )}
                >
                  {HIGHLIGHT_NAV_KEYS.has(link.key) ? (
                    <span className="nav-highlight-label">{t(link.key)}</span>
                  ) : (
                    t(link.key)
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle className="hidden sm:flex" />
            {!isAdmin && (
              <Link href="/cart" className="relative p-2 text-text-body hover:text-gold transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {hydrated && cartCount > 0 ? (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white animate-scale-in">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            )}
            <AnimatedProfileButton href={user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/login"} />
            <BookNowButton label={t("bookNow")} variant="secondary" size="sm" className="hidden lg:inline-flex" onNavigate={() => setMobileOpen(false)} />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden p-2 text-text-primary" aria-label={c.menuAria}>
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-0 z-50 bg-cream/98 overflow-y-auto xl:hidden"
          >
            <div className="flex flex-col p-6 pt-20 pb-32">
              <div className="mb-4 flex justify-end">
                <LanguageToggle />
              </div>
              {navDropdowns.map((dropdown) => (
                <div key={dropdown.href} className="border-b border-orange/15 py-2">
                  <Link href={dropdown.href} onClick={() => setMobileOpen(false)} className="py-2 text-base font-semibold text-gold flex items-center gap-2">
                    {dropdown.label}
                  </Link>
                  {dropdown.items.map((item, i) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 pl-4 text-text-body hover:text-gold animate-fade-in-up"
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
              {DIRECT_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "py-3 text-lg border-b border-orange/15",
                    HIGHLIGHT_NAV_KEYS.has(link.key)
                      ? "font-bold text-gold bg-gradient-to-r from-gold/10 to-orange/5 -mx-2 px-2 rounded-lg border border-gold/20"
                      : "text-text-primary"
                  )}
                >
                  {t(link.key)}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                <BookNowButton label={t("bookConsultation")} variant="secondary" className="w-full" onNavigate={() => setMobileOpen(false)} />
                <Button href="/login" variant="ghost" className="w-full">{c.common.loginRegister}</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
