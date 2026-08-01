import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { PRODUCT_KEYWORDS, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Rudraksha, Yantras & Spiritual Products — Shop Online Jaipur`,
  description: `Buy authentic Rudraksha, gemstones, yantras and Vedic spiritual products online from ${SITE.name}. Energized remedies recommended by ${SITE.acharya}, Jaipur's trusted astrologer.`,
  path: "/products",
  keywords: PRODUCT_KEYWORDS,
});

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
