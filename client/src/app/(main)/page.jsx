import HeroSection from "@/components/public/HeroSection";
import StatsRow from "@/components/public/StatsRow";
import FeaturedJobs from "@/components/public/FeaturedJobs";
import FeaturesSection from "@/components/public/FeaturesSection";
import PricingPreview from "@/components/public/PricingPreview";
import CTABanner from "@/components/public/CTABanner";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session/server";

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
