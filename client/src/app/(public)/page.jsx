import HeroSection from "@/components/public/HeroSection";
import StatsRow from "@/components/public/StatsRow";
import FeaturedJobs from "@/components/public/FeaturedJobs";
import FeaturesSection from "@/components/public/FeaturesSection";
import PricingPreview from "@/components/public/PricingPreview";
import CTABanner from "@/components/public/CTABanner";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <StatsRow />
      <FeaturedJobs />
      <FeaturesSection />
      <PricingPreview />
      <CTABanner />
    </>
  );
};

export default HomePage;
