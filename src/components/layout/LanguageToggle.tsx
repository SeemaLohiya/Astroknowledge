"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/cn";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={cn("flex rounded-full border border-gold/30 bg-orange/5 p-0.5 text-xs font-semibold", className)}>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn("rounded-full px-2.5 py-1 transition-colors", lang === "en" ? "bg-gold text-white" : "text-text-body hover:text-gold")}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("hi")}
        className={cn("rounded-full px-2.5 py-1 transition-colors", lang === "hi" ? "bg-gold text-white" : "text-text-body hover:text-gold")}
      >
        हिं
      </button>
    </div>
  );
}
