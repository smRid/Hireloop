import Link from "next/link";
import { Check, Zap, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import PricingCard from "./pricing-preview/PricingCard";

/* ── Plan data ─────────────────────────────────────────────────────── */
const SEEKER_PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "Get started with no commitment.",
    featured: false,
    cta: "Start Free",
    ctaHref: "/sign-up",
    features: [
      "Up to 10 job applications / month",
      "Basic job search & filters",
      "Save up to 5 jobs",
      "Email job alerts (weekly)",
      "Public profile page",
    ],
    missing: [
      "Salary insights",
      "One-click apply",
      "Resume builder",
      "Priority listing visibility",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    period: "per month",
    tagline: "Everything you need to land faster.",
    featured: true,
    badge: "Most Popular",
    cta: "Get Started",
    ctaHref: "/sign-up?plan=pro",
    features: [
      "Unlimited job applications",
      "Advanced search + smart filters",
      "Unlimited saved jobs",
      "Daily email & push alerts",
      "One-click apply",
      "Salary insights & benchmarks",
      "Resume builder (3 templates)",
      "Priority in recruiter searches",
    ],
    missing: [],
  },
  {
    id: "elite",
    name: "Elite",
    price: "$29",
    period: "per month",
    tagline: "White-glove support for serious movers.",
    featured: false,
    cta: "Go Elite",
    ctaHref: "/sign-up?plan=elite",
    features: [
      "Everything in Pro",
      "Unlimited resume templates",
      "1-on-1 career coaching session / mo",
      "LinkedIn profile review",
      "Featured seeker badge",
      "Early access to unlisted roles",
      "Dedicated account support",
    ],
    missing: [],
  },
];

/* ── Section ───────────────────────────────────────────────────────── */
const PricingPreview = () => {
  return (
    <section
      className="relative w-full bg-popover/70 px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="pricing-preview-heading"
    >
      {/* Gradient top border — mirrors FeaturesSection pattern */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--primary), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-5xl">
        {/* ── Section header ── */}
        <div className="mb-14 flex flex-col items-center gap-3 text-center">
          <span
            className="font-sans text-[12px] font-medium uppercase tracking-widest text-primary"
            aria-hidden="true"
          >
            Simple Pricing
          </span>
          <h2
            id="pricing-preview-heading"
            className="font-heading text-[36px] font-semibold leading-tight text-foreground sm:text-[40px]"
          >
            Plans for Every Seeker
          </h2>
          <p className="max-w-110 font-sans text-[16px] leading-relaxed text-muted-foreground">
            Start free, upgrade when you&apos;re ready. No hidden fees, cancel
            anytime.
          </p>
        </div>

        {/* ── 3-column card grid ── */}
        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-3">
          {SEEKER_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* ── Footer note + full pricing link ── */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="font-sans text-[13px] text-muted-foreground">
            Looking to hire?{" "}
            <Link
              href="/pricing"
              className="text-primary underline-offset-2 hover:underline"
            >
              View Recruiter plans →
            </Link>
          </p>
          <Link
            href="/pricing"
            className={cn(
              "inline-flex items-center gap-2 rounded-md border border-border/80 bg-card/50 shadow-sm shadow-black/10",
              "px-6 py-2.5 font-sans text-[14px] font-medium text-muted-foreground",
              "transition-all duration-200 hover:border-primary hover:text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            Compare all plans
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;
