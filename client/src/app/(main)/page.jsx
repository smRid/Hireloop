import HeroSection from "@/components/homepage/HeroSection";
import StatsRow from "@/components/homepage/StatsRow";
import FeaturedJobs from "@/components/homepage/FeaturedJobs";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import PricingPreview from "@/components/homepage/PricingPreview";
import CTABanner from "@/components/homepage/CTABanner";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/core/session";

const HomePage = async () => {
  const user = await getCurrentUser();
  const role = user?.role;
  
  if (user && !role) {
    redirect("/onboarding");
  }

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
