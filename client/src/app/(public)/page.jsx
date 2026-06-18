import HeroSection from "@/components/public/HeroSection";
import StatsRow from "@/components/public/StatsRow";
import FeaturedJobs from "@/components/public/FeaturedJobs";
import FeaturesSection from "@/components/public/FeaturesSection";
import PricingPreview from "@/components/public/PricingPreview";
import CTABanner from "@/components/public/CTABanner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  const role = user?.role;

  if (!role) {
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
