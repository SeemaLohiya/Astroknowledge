import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import { AppProviders } from "@/components/providers/AppProviders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { BackToTop } from "@/components/layout/BackToTop";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/constants";
import { DEFAULT_DESCRIPTION, SEO_KEYWORDS, absoluteUrl, pageMetadata } from "@/lib/seo";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF8F0" },
    { media: "(prefers-color-scheme: dark)", color: "#d97706" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  ...pageMetadata({
    title: `${SITE.name} | Best Vedic Astrologer Jaipur — ${SITE.acharya}`,
    description: DEFAULT_DESCRIPTION,
    path: "/",
    image: SITE.acharyaImage,
  }),
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  authors: [{ name: SITE.acharya, url: absoluteUrl("/about") }],
  creator: SITE.acharya,
  publisher: SITE.name,
  category: "Astrology",
  keywords: SEO_KEYWORDS,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/images/logo.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
    shortcut: "/images/logo.png",
  },
  other: {
    "geo.region": "IN-RJ",
    "geo.placename": "Jaipur",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
        <link rel="alternate" hrefLang="en-IN" href={SITE.url} />
        <link rel="alternate" hrefLang="hi-IN" href={SITE.url} />
        <link rel="alternate" hrefLang="x-default" href={SITE.url} />
      </head>
      <body className="bg-cosmic min-h-screen antialiased">
        <AppProviders>
          <Header />
          <main className="min-h-screen overflow-x-hidden pb-20 md:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
          <WhatsAppFab />
          <BackToTop />
        </AppProviders>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#FFF8F0", color: "#111827", border: "1px solid rgba(234,88,12,0.3)" },
          }}
        />
      </body>
    </html>
  );
}
