import dynamic from "next/dynamic";
import { SectionPartition } from "@/components/animations/SectionPartition";
import { ExploreOfferingsSection } from "@/components/home/ExploreOfferingsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeStatsSection } from "@/components/home/HomeStatsSection";
import { SectionBand } from "@/components/home/SectionBand";
import { TrustBadges } from "@/components/home/TrustBadges";
import { PageTransition } from "@/components/animations/PageTransition";
import { LazySection } from "@/components/animations/LazySection";

const ServicesSection = dynamic(() => import("@/components/home/ServicesSection").then((m) => ({ default: m.ServicesSection })));
const CoursesSection = dynamic(() => import("@/components/home/CoursesSection").then((m) => ({ default: m.CoursesSection })));
const ProductsSection = dynamic(() => import("@/components/home/ProductsSection").then((m) => ({ default: m.ProductsSection })));
const ProblemsSection = dynamic(() => import("@/components/home/ProblemsSection").then((m) => ({ default: m.ProblemsSection })));
const AchievementsSection = dynamic(() => import("@/components/home/AchievementsSection").then((m) => ({ default: m.AchievementsSection })));
const ReviewsSection = dynamic(() => import("@/components/home/ReviewsSection").then((m) => ({ default: m.ReviewsSection })));
const CosmicElementsSection = dynamic(
  () => import("@/components/home/CosmicElementsSection").then((m) => m.CosmicElementsSection),
  { loading: () => null }
);

export default function HomePage() {
  return (
    <PageTransition>
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
    </PageTransition>
  );
}
