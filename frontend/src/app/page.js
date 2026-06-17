import { Hero } from "@/components/home/Hero";
import { FeaturedJobs } from "@/components/home/FeaturedJobs";
import { Features } from "@/components/home/Features";
import { Pricing } from "@/components/home/Pricing";
import { CTA } from "@/components/home/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedJobs />
      <Features />
      <Pricing />
      <CTA />
    </>
  );
}
