import nextDynamic from "next/dynamic";
import type { Metadata } from "next";
import { SectionPartition } from "@/components/animations/SectionPartition";
import { ExploreOfferingsSection } from "@/components/home/ExploreOfferingsSection";
import { AdvertisementsSection } from "@/components/home/AdvertisementsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeStatsSection } from "@/components/home/HomeStatsSection";
import { SectionBand } from "@/components/home/SectionBand";
import { TrustBadges } from "@/components/home/TrustBadges";
import { PageTransition } from "@/components/animations/PageTransition";
import { LazySection } from "@/components/animations/LazySection";
import { SITE } from "@/lib/constants";
import { DEFAULT_DESCRIPTION, pageMetadata } from "@/lib/seo";
import { siteContent } from "@/lib/i18n/site-content";
import { contentStore } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: `Best Vedic Astrologer in Jaipur | ${SITE.acharya} — ${SITE.name}`,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  image: SITE.acharyaImage,
});

const ServicesSection = nextDynamic(() => import("@/components/home/ServicesSection").then((m) => ({ default: m.ServicesSection })), { loading: () => null });
const CoursesSection = nextDynamic(() => import("@/components/home/CoursesSection").then((m) => ({ default: m.CoursesSection })), { loading: () => null });
const ProductsSection = nextDynamic(() => import("@/components/home/ProductsSection").then((m) => ({ default: m.ProductsSection })), { loading: () => null });
const ProblemsSection = nextDynamic(() => import("@/components/home/ProblemsSection").then((m) => ({ default: m.ProblemsSection })), { loading: () => null });
const AchievementsSection = nextDynamic(() => import("@/components/home/AchievementsSection").then((m) => ({ default: m.AchievementsSection })), { loading: () => null });
const ReviewsSection = nextDynamic(() => import("@/components/home/ReviewsSection").then((m) => ({ default: m.ReviewsSection })), { loading: () => null });
const CosmicElementsSection = nextDynamic(
  () => import("@/components/home/CosmicElementsSection").then((m) => m.CosmicElementsSection),
  { loading: () => null }
);

function HomeFaqJsonLd() {
  const faqs = siteContent.en.faqs.slice(0, 8);
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function HomePage() {
  const content = await contentStore.get();
  const activeAds = (content.advertisements ?? [])
    .filter((a) => a.active)
    .sort((a, b) => a.order - b.order);

  return (
    <PageTransition>
      <HomeFaqJsonLd />
      <div className="home-page-shell relative overflow-hidden">
        <HeroSection />
        <SectionPartition variant="bold" />
        <SectionBand variant="peach">
          <HomeStatsSection />
        </SectionBand>
        <SectionPartition />
        <SectionBand variant="lavender">
          <ExploreOfferingsSection />
        </SectionBand>
        <SectionPartition variant="subtle" />
        <SectionBand variant="gold">
          <TrustBadges />
        </SectionBand>
        {activeAds.length > 0 ? (
          <>
            <SectionPartition />
            <SectionBand variant="coral">
              <AdvertisementsSection initialAds={activeAds} />
            </SectionBand>
          </>
        ) : null}
        <SectionPartition />
        <LazySection minHeight="200px" revealVariant="fade-up">
          <SectionBand variant="sky">
            <ServicesSection />
          </SectionBand>
        </LazySection>
        <SectionPartition />
        <LazySection minHeight="200px" revealVariant="fade-left">
          <SectionBand variant="peach">
            <CoursesSection />
          </SectionBand>
        </LazySection>
        <SectionPartition />
        <LazySection minHeight="220px" revealVariant="zoom">
          <SectionBand variant="lavender">
            <CosmicElementsSection />
          </SectionBand>
        </LazySection>
        <SectionPartition />
        <LazySection minHeight="200px" revealVariant="fade-right">
          <SectionBand variant="mint">
            <ProductsSection />
          </SectionBand>
        </LazySection>
        <SectionPartition />
        <LazySection minHeight="180px" revealVariant="scale">
          <SectionBand variant="coral">
            <ProblemsSection />
          </SectionBand>
        </LazySection>
        <SectionPartition />
        <LazySection minHeight="160px" revealVariant="blur-up">
          <SectionBand variant="cream">
            <AchievementsSection />
          </SectionBand>
        </LazySection>
        <SectionPartition />
        <LazySection minHeight="180px" revealVariant="fade-up">
          <SectionBand variant="sky">
            <ReviewsSection />
          </SectionBand>
        </LazySection>
        <SectionPartition variant="bold" />
        <SectionBand variant="lavender">
          <FAQSection />
        </SectionBand>
      </div>
    </PageTransition>
  );
}
