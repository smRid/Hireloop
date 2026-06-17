import Link from "next/link";
import { Check, Zap, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

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

/* ── Check / dash row ──────────────────────────────────────────────── */
function FeatureRow({ text, included = true }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
          included
            ? "bg-primary/15 text-primary"
            : "bg-muted text-muted-foreground/40",
        )}
        aria-hidden="true"
      >
        {included ? (
          <Check className="size-2.5" strokeWidth={3} />
        ) : (
          <span className="block h-px w-2 bg-current" />
        )}
      </span>
      <span
        className={cn(
          "font-sans text-[13px] leading-snug",
          included
            ? "text-foreground"
            : "text-muted-foreground/50 line-through",
        )}
      >
        {text}
      </span>
    </li>
  );
}

/* ── Single pricing card ───────────────────────────────────────────── */
function PricingCard({ plan }) {
  const {
    name,
    price,
    period,
    tagline,
    featured,
    badge,
    cta,
    ctaHref,
    features,
    missing,
  } = plan;

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-xl border p-6 transition-all duration-200",
        featured
          ? [
              "border-primary bg-card",
              "shadow-[0_0_0_1px_var(--primary),0_16px_48px_-8px_color-mix(in_oklch,var(--primary)_22%,transparent)]",
            ]
          : [
              "border-border bg-popover",
              "hover:border-primary/50",
              "hover:shadow-[0_8px_32px_-4px_color-mix(in_oklch,var(--primary)_10%,transparent)]",
            ],
      )}
      aria-label={`${name} plan`}
    >
      {/* ── Popular badge ── */}
      {badge && (
        <div
          className={cn(
            "absolute -top-3 left-1/2 -translate-x-1/2",
            "inline-flex items-center gap-1.5 rounded-full",
            "bg-primary px-3.5 py-1",
            "font-sans text-[11px] font-semibold uppercase tracking-wider text-primary-foreground",
          )}
          aria-label="Most popular plan"
        >
          <Star className="size-3 fill-current" aria-hidden="true" />
          {badge}
        </div>
      )}

      {/* ── Plan name + tagline ── */}
      <div className="mb-5 flex flex-col gap-1">
        <h3 className="font-heading text-[20px] font-semibold text-foreground">
          {name}
        </h3>
        <p className="font-sans text-[13px] text-muted-foreground">{tagline}</p>
      </div>

      {/* ── Price ── */}
      <div className="mb-6 flex items-end gap-1.5 border-b border-border pb-6">
        <span className="font-heading text-[44px] font-bold leading-none text-foreground">
          {price}
        </span>
        <span className="mb-1.5 font-sans text-[13px] text-muted-foreground">
          /{period}
        </span>
      </div>

      {/* ── Feature list ── */}
      <ul className="mb-8 flex flex-1 flex-col gap-3" role="list">
        {features.map((f) => (
          <FeatureRow key={f} text={f} included={true} />
        ))}
        {missing.map((f) => (
          <FeatureRow key={f} text={f} included={false} />
        ))}
      </ul>

      {/* ── CTA button ── */}
      <Link
        href={ctaHref}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-md",
          "px-5 py-2.5 font-sans text-[14px] font-medium",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          featured
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border border-border bg-transparent text-foreground hover:border-primary hover:text-primary",
        )}
      >
        {featured && <Zap className="size-4" aria-hidden="true" />}
        {cta}
      </Link>
    </article>
  );
}

/* ── Section ───────────────────────────────────────────────────────── */
export default function PricingPreview() {
  return (
    <section
      className="relative w-full bg-popover px-4 py-20 sm:px-6 lg:px-8"
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
              View Employer plans →
            </Link>
          </p>
          <Link
            href="/pricing"
            className={cn(
              "inline-flex items-center gap-2 rounded-md border border-border bg-transparent",
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
}
