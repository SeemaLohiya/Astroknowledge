import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AppProviders } from "@/components/providers/AppProviders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { BackToTop } from "@/components/layout/BackToTop";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { SITE } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: `${SITE.name} | Best Vedic Astrologer - ${SITE.acharya}`,
  description: `Expert Vedic astrology consultation by ${SITE.acharya}. Kundali analysis, Kundli Milan, Vastu, Numerology, spiritual products and more. ${SITE.experience} years experience.`,
  keywords: "vedic astrology, kundali, horoscope, acharya seema lohiya, astroknowledge, kundli milan, vastu, numerology",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cosmic min-h-screen antialiased">
        <AppProviders>
          <Header />
          <main className="min-h-screen pb-20 md:pb-0">{children}</main>
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
