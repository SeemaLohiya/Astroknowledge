"use client";

import { getNavDropdowns, type NavDropdown } from "@/lib/i18n/nav-i18n";
import { cn } from "@/lib/cn";
import { useProfile } from "@/components/profile/ProfileGate";
import { useCartStore } from "@/lib/cart-store";
import { useIsAdmin } from "@/lib/use-is-admin";
import { useHydrated } from "@/lib/use-hydrated";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { localizedTitle } from "@/lib/i18n/site-content";
import { fetchCatalogItems, fetchCategories, prefetchCatalogSnapshot } from "@/lib/catalog-cache";
import { scheduleIdle } from "@/lib/schedule-idle";
import { useLogout } from "@/lib/use-logout";
import { Flame, Heart, Info, LogOut, Mail } from "lucide-react";
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
  { href: "/healing", key: "healing" as const, icon: Heart },
  { href: "/pooja", key: "pooja" as const, icon: Flame },
  { href: "/about", key: "about" as const, icon: Info },
  { href: "/contact", key: "contact" as const, icon: Mail },
] as const;

function hashId(href: string) {
  const i = href.indexOf("#");
  return i >= 0 ? href.slice(i + 1) : null;
}

function categorySlug(href: string) {
  try {
    const q = href.includes("?") ? href.slice(href.indexOf("?")) : "";
    return new URLSearchParams(q).get("category");
  } catch {
    return null;
  }
}

export function Header() {
  const { t, c, lang } = useLanguage();
  const [navDropdowns, setNavDropdowns] = useState<NavDropdown[]>(() => getNavDropdowns(lang));
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, authReady } = useProfile();
  const handleLogout = useLogout();
  const isAdmin = useIsAdmin();
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const hydrated = useHydrated();
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const profileHref = user
    ? user.role === "admin"
      ? "/admin"
      : "/dashboard"
    : authReady
      ? "/login"
      : "/dashboard";

  useEffect(() => {
    setNavDropdowns(getNavDropdowns(lang));
  }, [lang]);

  useEffect(() => {
    let cancelled = false;

    async function syncLiveCatalog() {
      const base = getNavDropdowns(lang);
      try {
        await prefetchCatalogSnapshot();
        const [services, courses, categories] = await Promise.all([
          fetchCatalogItems<{ id: string; title: string; titleHindi?: string }>("services"),
          fetchCatalogItems<{ id: string; title: string; titleHindi?: string }>("courses"),
          fetchCategories(),
        ]);
        if (cancelled) return;

        const serviceMap = new Map(services.map((s) => [s.id, localizedTitle(s, lang)]));
        const courseMap = new Map(courses.map((s) => [s.id, localizedTitle(s, lang)]));
        const categoryMap = new Map(
          categories.map((cat) => [cat.id, localizedTitle({ title: cat.name, titleHindi: cat.nameHindi }, lang)])
        );

        setNavDropdowns(
          base.map((dropdown) => {
            if (dropdown.href === "/services") {
              return {
                ...dropdown,
                items: dropdown.items.map((item) => {
                  const id = hashId(item.href);
                  if (id && serviceMap.has(id)) return { ...item, label: serviceMap.get(id)! };
                  return item;
                }),
              };
            }
            if (dropdown.href === "/courses") {
              return {
                ...dropdown,
                items: dropdown.items.map((item) => {
                  const id = hashId(item.href);
                  if (id && courseMap.has(id)) return { ...item, label: courseMap.get(id)! };
                  return item;
                }),
              };
            }
            if (dropdown.href === "/products") {
              return {
                ...dropdown,
                items: dropdown.items.map((item) => {
                  const slug = categorySlug(item.href);
                  if (slug && categoryMap.has(slug)) return { ...item, label: categoryMap.get(slug)! };
                  return item;
                }),
              };
            }
            return dropdown;
          })
        );
      } catch {
        if (!cancelled) setNavDropdowns(base);
      }
    }

    const cancel = scheduleIdle(() => {
      void syncLiveCatalog();
    });

    return () => {
      cancelled = true;
      cancel();
    };
  }, [lang]);

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
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-2 px-3 py-3 sm:px-4">
          <Link href="/" className="group min-w-0 shrink">
            <SiteLogo size="sm" tagline={c.common.vedicWisdom} className="group-hover:[&_span]:text-gold transition-colors" />
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
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
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-1 px-3 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl",
                    active
                      ? "text-gold font-bold bg-gradient-to-r from-gold/12 to-orange/8 shadow-sm"
                      : "text-text-primary hover:text-gold hover:bg-white/80 hover:shadow-md"
                  )}
                >
                  <Icon className={cn("h-4 w-4 opacity-70 transition-transform duration-300 hover:scale-110", active && "text-gold")} />
                  {t(link.key)}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-gold to-gold-bright nav-tab-underline" />
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
            {!pathname.startsWith("/dashboard") && <AnimatedProfileButton href={profileHref} />}
            <BookNowButton label={t("bookNow")} variant="secondary" size="sm" className="hidden lg:inline-flex" onNavigate={() => setMobileOpen(false)} />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-text-primary" aria-label={c.menuAria}>
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-cream/98 overflow-y-auto lg:hidden animate-fade-in">
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
              {DIRECT_LINKS.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2 py-3 text-lg border-b border-orange/15 transition-colors",
                      active ? "font-semibold text-gold" : "text-text-primary hover:text-gold"
                    )}
                  >
                    <Icon className="h-5 w-5 opacity-70" />
                    {t(link.key)}
                  </Link>
                );
              })}
              <div className="mt-4 flex flex-col gap-2">
                <BookNowButton label={t("bookConsultation")} variant="secondary" className="w-full" onNavigate={() => setMobileOpen(false)} />
                {user ? (
                  <>
                    <Link
                      href={user.role === "admin" ? "/admin" : "/dashboard"}
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-bright px-6 py-3 text-base font-bold text-white shadow-md"
                    >
                      {user.role === "admin" ? "Admin Panel" : c.common.profile}
                    </Link>
                    <button
                      type="button"
                      onClick={() => { setMobileOpen(false); void handleLogout(); }}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      {c.common.logout}
                    </button>
                  </>
                ) : (
                  <Button href="/login" variant="ghost" className="w-full">{c.common.loginRegister}</Button>
                )}
              </div>
            </div>
          </div>
        )}
    </>
  );
}
