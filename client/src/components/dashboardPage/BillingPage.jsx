"use client";

import Link from "next/link";
import { Check, Zap, Building2, ArrowUpRight } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════════
   PLAN DATA  (mirrors pricing/page.jsx exactly)
   ════════════════════════════════════════════════════════════════════ */

const SEEKER_PLANS = [
  {
    id: "free",
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
    id: "pro",
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
    id: "premium",
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
    id: "free",
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
    id: "growth",
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
    id: "enterprise",
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

/* ════════════════════════════════════════════════════════════════════
   MOCK PAYMENT HISTORY
   ════════════════════════════════════════════════════════════════════ */

const PAYMENT_HISTORY = [
  {
    id: "txn_01HWKQ9ABC",
    date: "Jun 1, 2026",
    plan: "Pro",
    amount: "$12.00",
    status: "Success",
  },
  {
    id: "txn_01HVJR8DEF",
    date: "May 1, 2026",
    plan: "Pro",
    amount: "$12.00",
    status: "Success",
  },
  {
    id: "txn_01HU9P7GHI",
    date: "Apr 1, 2026",
    plan: "Pro",
    amount: "$12.00",
    status: "Success",
  },
  {
    id: "txn_01HT8O6JKL",
    date: "Mar 1, 2026",
    plan: "Free",
    amount: "$0.00",
    status: "Success",
  },
  {
    id: "txn_01HS7N5MNO",
    date: "Feb 1, 2026",
    plan: "Pro",
    amount: "$12.00",
    status: "Failed",
  },
  {
    id: "txn_01HR6M4PQR",
    date: "Jan 1, 2026",
    plan: "Pro",
    amount: "$12.00",
    status: "Success",
  },
];

/* ════════════════════════════════════════════════════════════════════
   FEATURE ROW  (reused from pricing page)
   ════════════════════════════════════════════════════════════════════ */

function FeatureRow({ text, included }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className={cn(
          "mt-px flex size-4.5 shrink-0 items-center justify-center rounded-full",
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
          "font-sans text-[13px] leading-snug",
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
   COMPACT PLAN CARD
   ════════════════════════════════════════════════════════════════════ */

function PlanCard({ plan, isCurrent, isRecruiter }) {
  const isCustom = plan.price === "Custom";

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-2xl border p-6 transition-all duration-300",
        isCurrent
          ? [
              "border-primary bg-popover",
              "shadow-[0_0_0_1px_var(--primary),0_12px_40px_-6px_color-mix(in_oklch,var(--primary)_20%,transparent)]",
            ]
          : plan.featured && !isCurrent
            ? [
                "border-border bg-card",
                "hover:border-primary/50",
                "hover:shadow-[0_8px_32px_-4px_color-mix(in_oklch,var(--primary)_10%,transparent)]",
              ]
            : [
                "border-border bg-card",
                "hover:border-primary/40",
                "hover:shadow-[0_8px_32px_-4px_color-mix(in_oklch,var(--primary)_8%,transparent)]",
              ],
      )}
      aria-label={`${plan.name} plan${isCurrent ? " — your current plan" : ""}`}
    >
      {/* Current plan badge — top absolute */}
      {isCurrent && (
        <div
          className={cn(
            "absolute -top-3 left-1/2 -translate-x-1/2",
            "inline-flex items-center rounded-full",
            "bg-primary px-3.5 py-0.5",
            "font-sans text-[11px] font-semibold uppercase tracking-wider text-primary-foreground",
            "shadow-[0_3px_10px_-2px_color-mix(in_oklch,var(--primary)_40%,transparent)]",
          )}
        >
          Current Plan
        </div>
      )}

      {/* Plan name + tagline */}
      <div className="mb-4 flex flex-col gap-1 pt-1">
        <h3 className="font-heading text-[18px] font-bold text-foreground">
          {plan.name}
        </h3>
        <p className="font-sans text-[12px] leading-relaxed text-muted-foreground">
          {plan.tagline}
        </p>
      </div>

      {/* Price */}
      <div className="mb-4 flex items-end gap-1.5 border-b border-border pb-4">
        {isCustom ? (
          <span className="font-heading text-[28px] font-bold leading-none text-primary">
            Custom
          </span>
        ) : (
          <>
            <span className="font-heading text-[36px] font-bold leading-none text-primary">
              {plan.price}
            </span>
            <span className="mb-1 font-sans text-[14px] text-muted-foreground">
              {plan.priceNote}
            </span>
          </>
        )}
      </div>

      {/* Features */}
      <ul
        className="mb-6 flex flex-1 flex-col gap-2.5"
        role="list"
        aria-label={`${plan.name} features`}
      >
        {plan.features.map((f) => (
          <FeatureRow key={f} text={f} included={true} />
        ))}
        {plan.missing.map((f) => (
          <FeatureRow key={f} text={f} included={false} />
        ))}
      </ul>

      {/* CTA or "Current Plan" button */}
      {isCurrent ? (
        <div
          className={cn(
            "flex h-10 w-full items-center justify-center rounded-xl",
            "border border-primary/30 bg-primary/10",
            "font-sans text-[13px] font-medium text-primary",
          )}
          aria-label="This is your current plan"
        >
          ✓ Your Current Plan
        </div>
      ) : (
        <Link
          href={plan.ctaHref}
          className={cn(
            "inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl",
            "font-sans text-[13px] font-medium",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            plan.featured
              ? [
                  "bg-primary text-primary-foreground",
                  "hover:bg-primary/90",
                  "hover:shadow-[0_4px_14px_-2px_color-mix(in_oklch,var(--primary)_30%,transparent)]",
                ]
              : [
                  "border border-border bg-transparent text-foreground",
                  "hover:border-primary hover:text-primary",
                ],
          )}
        >
          {plan.featured &&
            (isRecruiter ? (
              <Building2 className="size-3.5" aria-hidden="true" />
            ) : (
              <Zap className="size-3.5" aria-hidden="true" />
            ))}
          {plan.cta}
        </Link>
      )}
    </article>
  );
}

/* ════════════════════════════════════════════════════════════════════
   CURRENT PLAN BANNER
   ════════════════════════════════════════════════════════════════════ */

function CurrentPlanBanner({ role, currentPlanId }) {
  const isRecruiter = role === "recruiter";

  /* Lookup current plan details */
  const plans = isRecruiter ? RECRUITER_PLANS : SEEKER_PLANS;
  const plan = plans.find((p) => p.id === currentPlanId) ?? plans[1];

  const isFree = plan.id === "free";
  const isCustom = plan.price === "Custom";

  /* Usage mock — only relevant for non-free plans */
  const usageLabel = isRecruiter
    ? "Active job posts this month"
    : "Applications used this month";
  const usageUsed = isRecruiter ? 7 : 24;
  const usageLimit = isRecruiter ? 20 : 30;
  const usagePct = Math.min((usageUsed / usageLimit) * 100, 100);
  const nearLimit = usagePct >= 80;

  const priceDisplay = isCustom
    ? "Custom pricing"
    : isFree
      ? "Free forever"
      : `${plan.price}${plan.priceNote}`;

  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-xl bg-popover p-8",
        "border-l-4 border-l-primary border border-border",
        /* suppress the left border from the shorthand border above */
        "border-y-border border-r-border",
      )}
      aria-label="Current subscription details"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {/* Left — plan info */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-[24px] font-bold leading-tight text-foreground">
              {plan.name} Plan
            </h2>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5",
                "font-sans text-[11px] font-medium uppercase tracking-wide",
                "bg-primary/10 text-primary border border-primary/20",
              )}
            >
              Active
            </span>
          </div>

          <p className="font-sans text-[16px] text-muted-foreground">
            {priceDisplay}
          </p>

          {!isFree && !isCustom && (
            <p className="font-sans text-[14px] text-muted-foreground">
              Renews on{" "}
              <span className="font-medium text-foreground">Jul 1, 2026</span>
            </p>
          )}
        </div>

        {/* Right — usage + buttons */}
        <div className="flex flex-col items-start gap-4 sm:items-end">
          {/* Usage bar */}
          {!isFree && !isCustom && (
            <div className="flex w-full flex-col gap-2 sm:w-60">
              {/* Label */}
              <p
                className={cn(
                  "font-sans text-[14px]",
                  nearLimit ? "text-chart-2" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "font-medium",
                    nearLimit ? "text-chart-2" : "text-foreground",
                  )}
                >
                  {usageUsed}
                </span>
                {" / "}
                {usageLimit} {usageLabel}
              </p>

              {/* Progress track */}
              <div
                className="h-2 w-full overflow-hidden rounded-full border border-border bg-card"
                role="progressbar"
                aria-valuenow={usageUsed}
                aria-valuemin={0}
                aria-valuemax={usageLimit}
                aria-label={`${usageUsed} of ${usageLimit} ${usageLabel}`}
              >
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    usagePct >= 100
                      ? "bg-chart-4"
                      : nearLimit
                        ? "bg-chart-2"
                        : "bg-primary",
                  )}
                  style={{ width: `${usagePct}%` }}
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Manage Plan ghost */}
            <button
              type="button"
              className={cn(
                "h-9 rounded-lg border border-border bg-transparent px-4",
                "font-sans text-[14px] font-medium text-muted-foreground",
                "transition-colors duration-150",
                "hover:border-primary/40 hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              Manage Plan
            </button>

            {/* Upgrade Plan teal */}
            <button
              type="button"
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-lg px-4",
                "bg-primary text-primary-foreground",
                "font-sans text-[14px] font-medium",
                "transition-all duration-150 hover:bg-primary/90",
                "hover:shadow-[0_4px_16px_-2px_color-mix(in_oklch,var(--primary)_30%,transparent)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PLAN CARDS GRID
   ════════════════════════════════════════════════════════════════════ */

function PlanCardsSection({ role, currentPlanId }) {
  const isRecruiter = role === "recruiter";
  const plans = isRecruiter ? RECRUITER_PLANS : SEEKER_PLANS;

  return (
    <section aria-labelledby="plans-heading">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <h2
            id="plans-heading"
            className="font-heading text-[18px] font-semibold text-foreground"
          >
            Available Plans
          </h2>
          <div className="h-px flex-1 bg-border" aria-hidden="true" />
        </div>

        {/* Extra top padding absorbs the -top-3 badge on current plan card */}
        <div
          className="grid grid-cols-1 gap-5 pt-3 sm:grid-cols-3"
          role="list"
          aria-label="Subscription plans"
        >
          {plans.map((plan) => (
            <div key={plan.id} role="listitem">
              <PlanCard
                plan={plan}
                isCurrent={plan.id === currentPlanId}
                isRecruiter={isRecruiter}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAYMENT HISTORY TABLE
   ════════════════════════════════════════════════════════════════════ */

const PLAN_PILL_CLS = {
  Pro: "bg-primary/10 text-primary",
  Growth: "bg-primary/10 text-primary",
  Premium: "bg-primary/10 text-primary",
  Enterprise: "bg-chart-2/10 text-chart-2",
  Free: "bg-secondary text-secondary-foreground",
};

function PaymentHistorySection({ history }) {
  return (
    <section aria-labelledby="payment-history-heading">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <h2
            id="payment-history-heading"
            className="font-heading text-[18px] font-semibold text-foreground"
          >
            Payment History
          </h2>
          <div className="h-px flex-1 bg-border" aria-hidden="true" />
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table aria-labelledby="payment-history-heading">
            {/* Header */}
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                {[
                  { label: "Date", cls: "pl-6 w-[150px]" },
                  { label: "Plan", cls: "w-[120px]" },
                  { label: "Amount", cls: "w-[110px]" },
                  { label: "Transaction ID", cls: "w-[200px]" },
                  { label: "Status", cls: "pr-6 w-[110px] text-right" },
                ].map(({ label, cls }) => (
                  <TableHead
                    key={label}
                    className={cn(
                      "font-sans text-[12px] font-medium uppercase tracking-widest",
                      "text-muted-foreground/60 py-3",
                      cls,
                    )}
                  >
                    {label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            {/* Body */}
            <TableBody>
              {history.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-border transition-colors duration-100 hover:bg-popover"
                >
                  {/* Date */}
                  <TableCell className="pl-6 py-3.5">
                    <span className="font-sans text-[14px] text-foreground whitespace-nowrap">
                      {row.date}
                    </span>
                  </TableCell>

                  {/* Plan */}
                  <TableCell className="py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5",
                        "font-sans text-[12px] font-medium",
                        PLAN_PILL_CLS[row.plan] ?? PLAN_PILL_CLS.Free,
                      )}
                    >
                      {row.plan}
                    </span>
                  </TableCell>

                  {/* Amount */}
                  <TableCell className="py-3.5">
                    <span className="font-heading text-[14px] font-semibold text-primary">
                      {row.amount}
                    </span>
                  </TableCell>

                  {/* Transaction ID */}
                  <TableCell className="py-3.5">
                    <span className="font-mono text-[12px] text-muted-foreground truncate block max-w-45">
                      {row.id}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="pr-6 py-3.5">
                    <div className="flex justify-end">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5",
                          "font-sans text-[12px] font-medium",
                          row.status === "Success"
                            ? "bg-chart-3/10 text-chart-3"
                            : "bg-chart-4/10 text-chart-4",
                        )}
                      >
                        {row.status}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   EXPORTED PAGE COMPONENT  (consumed by both seeker and recruiter)
   ════════════════════════════════════════════════════════════════════ */

export default function BillingPage({
  role = "seeker",
  currentPlanId = "pro",
}) {
  return (
    <div className="flex flex-col gap-10">
      {/* Page heading */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-bold leading-tight text-foreground">
          Billing &amp; Subscription
        </h1>
        <p className="font-sans text-[14px] text-muted-foreground">
          Manage your plan, track usage, and review payment history.
        </p>
      </div>

      {/* 1 — Current plan banner */}
      <CurrentPlanBanner role={role} currentPlanId={currentPlanId} />

      {/* 2 — Plan cards */}
      <PlanCardsSection role={role} currentPlanId={currentPlanId} />

      {/* 3 — Payment history */}
      <PaymentHistorySection history={PAYMENT_HISTORY} />
    </div>
  );
}
