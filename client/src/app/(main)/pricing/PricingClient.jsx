"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Zap, Star, Building2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

/* ════════════════════════════════════════════════════════════════════
   PLAN DATA
   ════════════════════════════════════════════════════════════════════ */

const SEEKER_PLANS = [
  {
    id: "seeker-free",
    name: "Free",
    price: "$0",
    priceNote: "forever",
    tagline: "Everything you need to get started.",
    featured: false,
    cta: "Start Free",
    ctaHref: "/sign-up",
    features: [
      "Up to 10 applications / month",
      "Basic search & filters",
      "Save up to 5 jobs",
      "Weekly email job alerts",
      "Public profile page",
    ],
    missing: [
      "Salary insights & benchmarks",
      "One-click apply",
      "Resume builder",
      "Priority in recruiter searches",
      "Career coaching",
    ],
  },
  {
    id: "seeker-pro",
    name: "Pro",
    price: "$12",
    priceNote: "/ month",
    tagline: "Land faster with every tool you need.",
    featured: true,
    badge: "Most Popular",
    cta: "Get Pro",
    ctaHref: "/sign-up?plan=seeker-pro",
    features: [
      "Unlimited applications",
      "Advanced search + smart filters",
      "Unlimited saved jobs",
      "Daily email & push alerts",
      "One-click apply",
      "Salary insights & benchmarks",
      "Resume builder — 3 templates",
      "Priority in recruiter searches",
    ],
    missing: ["1-on-1 career coaching", "Featured seeker badge"],
  },
  {
    id: "seeker-premium",
    name: "Premium",
    price: "$29",
    priceNote: "/ month",
    tagline: "White-glove support for serious movers.",
    featured: false,
    cta: "Go Premium",
    ctaHref: "/sign-up?plan=seeker-premium",
    features: [
      "Everything in Pro",
      "Unlimited resume templates",
      "1-on-1 career coaching / month",
      "LinkedIn profile review",
      "Featured seeker badge",
      "Early access to unlisted roles",
      "Dedicated account support",
    ],
    missing: [],
  },
];

const RECRUITER_PLANS = [
  {
    id: "recruiter-free",
    name: "Free",
    price: "$0",
    priceNote: "forever",
    tagline: "Post your first roles at no cost.",
    featured: false,
    cta: "Post a Job Free",
    ctaHref: "/sign-up?role=recruiter",
    features: [
      "3 active job postings",
      "Standard candidate search",
      "Basic applicant tracking",
      "Email notifications",
      "Company profile page",
    ],
    missing: [
      "Promoted job listings",
      "Candidate outreach",
      "ATS integrations",
      "Analytics dashboard",
      "Dedicated support",
    ],
  },
  {
    id: "recruiter-growth",
    name: "Growth",
    price: "$99",
    priceNote: "/ month",
    tagline: "Everything a growing team needs to hire.",
    featured: true,
    badge: "Best Value",
    cta: "Start Hiring",
    ctaHref: "/sign-up?plan=recruiter-growth",
    features: [
      "20 active job postings",
      "Advanced candidate search & filters",
      "Full applicant tracking pipeline",
      "Promoted listings — 3 boosts / mo",
      "Candidate outreach — 50 / mo",
      "ATS integrations (Greenhouse, Lever)",
      "Analytics & conversion dashboard",
      "Team seat — up to 5 users",
    ],
    missing: ["Unlimited postings", "Dedicated account manager"],
  },
  {
    id: "recruiter-enterprise",
    name: "Enterprise",
    price: "Custom",
    priceNote: "pricing",
    tagline: "Built for high-volume hiring at scale.",
    featured: false,
    cta: "Contact Sales",
    ctaHref: "/contact",
    features: [
      "Unlimited job postings",
      "Unlimited candidate outreach",
      "Custom ATS & HRIS integrations",
      "Unlimited team seats",
      "Priority promoted listings",
      "Dedicated account manager",
      "SLA-backed support",
      "Custom reporting & data exports",
    ],
    missing: [],
  },
];

const FAQ_ITEMS = [
  {
    id: "faq-cancel",
    question: "Can I cancel my plan at any time?",
    answer:
      "Yes — you can cancel your subscription at any time from your account settings. Cancellations take effect at the end of your current billing cycle, so you'll retain full access until then. No cancellation fees, ever.",
  },
  {
    id: "faq-switch",
    question: "What happens if I switch plans mid-cycle?",
    answer:
      "Upgrades take effect immediately and you're billed a prorated amount for the remainder of the current period. Downgrades take effect at the start of your next billing cycle — you keep your current features until then.",
  },
  {
    id: "faq-refund",
    question: "Do you offer refunds?",
    answer:
      "We offer a full refund within 7 days of your initial purchase if you're not satisfied. After that, we don't issue refunds for partial billing periods, but you're always free to cancel before your next renewal.",
  },
  {
    id: "faq-trial",
    question: "Is there a free trial for paid plans?",
    answer:
      "Pro and Growth plans include a 14-day free trial — no credit card required. You'll get access to all features in the plan and can cancel any time before the trial ends without being charged.",
  },
  {
    id: "faq-seats",
    question: "How do team seats work on Recruiter plans?",
    answer:
      "The Growth plan includes 5 team seats. You can add additional seats at $15 per seat per month. The Enterprise plan includes unlimited seats — ideal for large talent acquisition teams with complex workflows.",
  },
  {
    id: "faq-data",
    question: "What happens to my data if I downgrade to Free?",
    answer:
      "Your data is never deleted when you downgrade. Applications, saved jobs, and profile information are preserved. You'll simply lose access to premium features, and any postings or saved items that exceed Free plan limits will be paused — not removed.",
  },
];

/* ════════════════════════════════════════════════════════════════════
   PRIMITIVES
   ════════════════════════════════════════════════════════════════════ */

function FeatureRow({ text, included }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={cn(
          "mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full transition-colors",
          included
            ? "bg-primary/15 text-primary"
            : "bg-muted text-muted-foreground/30",
        )}
        aria-hidden="true"
      >
        <Check className="size-2.5" strokeWidth={3} />
      </span>
      <span
        className={cn(
          "font-sans text-[14px] leading-snug",
          included
            ? "text-foreground"
            : "text-muted-foreground/40 line-through",
        )}
      >
        {text}
      </span>
    </li>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PRICING CARD
   ════════════════════════════════════════════════════════════════════ */

function PricingCard({ plan, isRecruiter }) {
  const {
    name,
    price,
    priceNote,
    tagline,
    featured,
    badge,
    cta,
    ctaHref,
    features,
    missing,
  } = plan;

  const isCustom = price === "Custom";

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-2xl border p-8 transition-all duration-300",
        featured
          ? [
              "scale-[1.02] border-primary bg-popover z-10",
              "shadow-[0_0_0_1px_var(--primary),0_20px_60px_-8px_color-mix(in_oklch,var(--primary)_25%,transparent)]",
            ]
          : [
              "border-border bg-card",
              "hover:border-primary/50",
              "hover:shadow-[0_8px_32px_-4px_color-mix(in_oklch,var(--primary)_10%,transparent)]",
            ],
      )}
      aria-label={`${name} plan`}
    >
      {/* ── Featured badge ── */}
      {badge && (
        <div
          className={cn(
            "absolute -top-3.5 left-1/2 -translate-x-1/2",
            "inline-flex items-center gap-1.5 rounded-full",
            "bg-primary px-4 py-1",
            "font-sans text-[11px] font-semibold uppercase tracking-wider text-primary-foreground",
            "shadow-[0_4px_12px_-2px_color-mix(in_oklch,var(--primary)_40%,transparent)]",
          )}
          aria-label={badge}
        >
          <Star className="size-3 fill-current" aria-hidden="true" />
          {badge}
        </div>
      )}

      {/* ── Plan name + tagline ── */}
      <div className="mb-6 flex flex-col gap-1.5">
        <h3 className="font-heading text-[20px] font-bold text-foreground">
          {name}
        </h3>
        <p className="font-sans text-[13px] leading-relaxed text-muted-foreground">
          {tagline}
        </p>
      </div>

      {/* ── Price block ── */}
      <div className="mb-6 flex items-end gap-2 border-b border-border pb-6">
        {isCustom ? (
          <span className="font-heading text-[36px] font-bold leading-none text-primary">
            Custom
          </span>
        ) : (
          <>
            <span className="font-heading text-[48px] font-bold leading-none text-primary">
              {price}
            </span>
            <span className="mb-1.5 font-sans text-[16px] text-muted-foreground">
              {priceNote}
            </span>
          </>
        )}
      </div>

      {/* ── Feature list ── */}
      <ul
        className="mb-8 flex flex-1 flex-col gap-3"
        role="list"
        aria-label={`${name} plan features`}
      >
        {features.map((f) => (
          <FeatureRow key={f} text={f} included={true} />
        ))}
        {missing.map((f) => (
          <FeatureRow key={f} text={f} included={false} />
        ))}
      </ul>

      {/* ── CTA ── */}
      <Link
        href={ctaHref}
        className={cn(
          "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl",
          "font-sans text-[14px] font-medium",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          featured
            ? [
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90",
                "hover:shadow-[0_4px_16px_-2px_color-mix(in_oklch,var(--primary)_35%,transparent)]",
              ]
            : [
                "border border-border bg-transparent text-foreground",
                "hover:border-primary hover:text-primary",
              ],
        )}
      >
        {featured &&
          (isRecruiter ? (
            <Building2 className="size-4" aria-hidden="true" />
          ) : (
            <Zap className="size-4" aria-hidden="true" />
          ))}
        {cta}
      </Link>
    </article>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ROLE TOGGLE
   ════════════════════════════════════════════════════════════════════ */

function RoleToggle({ role, onChange }) {
  const options = [
    { value: "seekers", label: "For Job Seekers" },
    { value: "recruiters", label: "For Recruiters" },
  ];

  return (
    <div
      role="group"
      aria-label="Switch between job seeker and recruiter pricing"
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card p-1",
        "shadow-[inset_0_1px_3px_0_color-mix(in_oklch,var(--background)_60%,transparent)]",
      )}
    >
      {options.map(({ value, label }) => {
        const isActive = role === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(value)}
            className={cn(
              "relative px-6 py-2 rounded-full font-sans text-[14px] font-medium",
              "transition-all duration-250 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? [
                    "bg-primary text-primary-foreground",
                    "shadow-[0_2px_8px_-1px_color-mix(in_oklch,var(--primary)_30%,transparent)]",
                  ]
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   FAQ ACCORDION
   ════════════════════════════════════════════════════════════════════ */

function PricingFAQ() {
  return (
    <section aria-labelledby="faq-heading" className="mx-auto w-full max-w-3xl">
      {/* Heading */}
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <span
          className="font-sans text-[12px] font-medium uppercase tracking-widest text-primary"
          aria-hidden="true"
        >
          Got Questions?
        </span>
        <h2
          id="faq-heading"
          className="font-heading text-[32px] font-bold text-foreground"
        >
          Frequently Asked
        </h2>
      </div>

      {/* Accordion */}
      <Accordion type="single" collapsible className="flex flex-col gap-3">
        {FAQ_ITEMS.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className={cn(
              /* Reset shadcn default bottom-border-only style */
              "rounded-xl border border-border bg-card overflow-hidden",
              "not-last:border-b-border not-last:border-b",
              /* Open state: swap left border to teal via group trick */
              "data-[state=open]:border-l-2 data-[state=open]:border-l-primary",
              "transition-all duration-200",
            )}
          >
            <AccordionTrigger
              className={cn(
                /* Override default shadcn trigger styles */
                "px-5 py-4 hover:no-underline",
                "font-sans text-[15px] font-medium text-foreground",
                "[&>svg]:text-muted-foreground",
                "data-[state=open]:[&>svg]:text-primary",
              )}
            >
              {item.question}
            </AccordionTrigger>
            <AccordionContent
              className={cn(
                "px-5 pb-5",
                "font-sans text-[14px] leading-relaxed text-muted-foreground",
              )}
            >
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */

export default function PricingPage() {
  const [role, setRole] = useState("seekers");

  const isRecruiter = role === "recruiters";
  const plans = isRecruiter ? RECRUITER_PLANS : SEEKER_PLANS;

  return (
    <div className="w-full bg-background">
      {/* ══════════════════════════════════════════════════════════════
          PAGE HEADER
          ══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden border-b border-border bg-card">
        {/* Subtle radial teal glow at top-center */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-80 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 0%, color-mix(in oklch, var(--primary) 8%, transparent), transparent)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          {/* Eyebrow */}
          <span
            className="font-sans text-[12px] font-medium uppercase tracking-widest text-primary"
            aria-hidden="true"
          >
            Simple, Transparent Pricing
          </span>

          {/* Main heading */}
          <h1 className="font-heading text-[40px] font-bold leading-[1.1] tracking-tight text-foreground sm:text-[48px]">
            Pay for leverage,
            <br />
            not listings.
          </h1>

          {/* Sub-headline */}
          <p className="max-w-lg font-sans text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
            Start free and upgrade when you need more. No hidden fees, no
            lock-in — cancel any time, instantly.
          </p>

          {/* Role toggle */}
          <RoleToggle role={role} onChange={setRole} />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          PLAN LABEL ROW  (context beneath the toggle)
          ══════════════════════════════════════════════════════════════ */}
      <div className="border-b border-border bg-card/40">
        <div className="mx-auto flex max-w-4xl items-center justify-center px-4 py-3 sm:px-6 lg:px-8">
          <p className="font-sans text-[13px] text-muted-foreground">
            {isRecruiter
              ? "Recruiter plans · per seat, billed monthly · save 20% with annual billing"
              : "Seeker plans · per person, billed monthly · save 20% with annual billing"}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          PRICING CARDS
          ══════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Outer wrapper — extra top padding absorbs the scale(1.02) on featured */}
        <div
          className="grid grid-cols-1 items-stretch gap-6 pt-4 sm:grid-cols-3"
          role="list"
          aria-label={`${isRecruiter ? "Recruiter" : "Job seeker"} pricing plans`}
        >
          {plans.map((plan) => (
            <div key={plan.id} role="listitem">
              <PricingCard plan={plan} isRecruiter={isRecruiter} />
            </div>
          ))}
        </div>

        {/* ── Cross-role nudge ── */}
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="font-sans text-[14px] text-muted-foreground">
            {isRecruiter ? (
              <>
                Looking for a job?{" "}
                <button
                  type="button"
                  onClick={() => setRole("seekers")}
                  className="font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  View Seeker plans
                </button>
              </>
            ) : (
              <>
                Hiring talent?{" "}
                <button
                  type="button"
                  onClick={() => setRole("recruiters")}
                  className="font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  View Recruiter plans
                </button>
              </>
            )}
          </p>
          <Link
            href="/sign-up"
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border border-border bg-transparent",
              "px-6 py-2.5 font-sans text-[14px] font-medium text-muted-foreground",
              "transition-all duration-200 hover:border-primary hover:text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            Start for free today
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          DIVIDER
          ══════════════════════════════════════════════════════════════ */}
      <div
        className="mx-auto h-px max-w-3xl"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--border), transparent)",
        }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════════════════════════
          FAQ
          ══════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <PricingFAQ />
      </div>
    </div>
  );
}
