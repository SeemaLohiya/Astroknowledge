"use client";

import { PolicyPage } from "@/components/ui/PolicyPage";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { legalContent } from "@/lib/i18n/legal-content";

export default function ShippingPage() {
  const { lang } = useLanguage();
  const { title, sections } = legalContent.shipping[lang];
  return <PolicyPage title={title} sections={sections} />;
}
