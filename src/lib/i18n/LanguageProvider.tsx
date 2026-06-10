"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Lang, translations } from "./translations";
import { SiteContentLang, siteContent } from "./site-content";
import { mergeSiteContent, UiStrings } from "./ui-strings";

export type AppContent = SiteContentLang & UiStrings;

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  c: AppContent;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
  c: mergeSiteContent(siteContent.en, "en"),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("astro-lang") as Lang | null;
    const resolved = saved === "en" || saved === "hi" ? saved : "en";
    setLangState(resolved);
    document.documentElement.lang = resolved;
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("astro-lang", l);
    document.documentElement.lang = l;
  }, []);

  const t = (key: string) => translations[lang][key] || translations.en[key] || key;
  const c = mergeSiteContent(siteContent[lang], lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, c }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
