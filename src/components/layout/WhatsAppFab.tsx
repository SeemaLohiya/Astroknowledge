"use client";

import { SITE } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export function WhatsAppFab() {
  const { c } = useLanguage();
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;
  const href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Namaste! I would like to consult with Acharya Seema Lohiya.")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={c.hero.whatsapp}
      className="whatsapp-fab fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition-transform hover:scale-105 active:scale-95 md:bottom-6"
    >
      <span className="whatsapp-fab-pulse absolute inset-0 rounded-full bg-[#25D366]" aria-hidden />
      <MessageCircle className="relative h-7 w-7" />
    </a>
  );
}
