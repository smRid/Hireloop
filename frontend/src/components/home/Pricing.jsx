"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Sparkles, Crown, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "starter",
    icon: Crown,
    name: "Starter",
    monthly: 0,
    yearly: 0,
    description: "Everything you need to begin your search.",
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight cards",
      "1-click apply, up to 10/mo",
    ],
    featured: false,
    cta: "Start for free",
  },
  {
    id: "growth",
    icon: Sparkles,
    name: "Growth",
    monthly: 17,
    yearly: 13,
    description: "For serious job seekers who want an edge.",
    features: [
      "Unlimited 1-click apply",
      "Full salary intelligence",
      "AI resume builder",
      "Skill-gap analysis",
      "Priority job alerts",
    ],
    featured: true,
    cta: "Get Growth",
  },
  {
    id: "premium",
    icon: Zap,
    name: "Premium",
    monthly: 99,
    yearly: 79,
    description: "Career management for high-performers.",
    features: [
      "Everything in Growth",
      "Multi-profile portfolios",
      "Shared talent rooms",
      "Recruiter view (read-only)",
      "Dedicated career coach",
    ],
    featured: false,
    cta: "Go Premium",
  },
];

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
      <span className="font-sans text-xs font-semibold tracking-[0.18em] text-brand uppercase">
        {children}
      </span>
      <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
    </div>
  );
}

function PlanCard({ plan, yearly }) {
  const price = yearly ? plan.yearly : plan.monthly;
  const Icon = plan.icon;
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-7 transition-all duration-200",
        plan.featured
          ? "border-brand/40 bg-brand/5 shadow-xl shadow-brand/10 ring-1 ring-brand/20"
          : "border-white/[0.07] bg-card hover:border-white/12",
      )}
    >
      {plan.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="rounded-full bg-brand px-3 text-[11px] font-bold text-brand-foreground shadow-lg">
            Most Popular
          </Badge>
        </div>
      )}

      {/* Plan header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-xl",
              plan.featured ? "bg-brand/20" : "bg-muted",
            )}
          >
            <Icon
              className={cn(
                "size-4",
                plan.featured ? "text-brand" : "text-muted-foreground",
              )}
              strokeWidth={1.5}
            />
          </div>
          <span className="font-heading text-base font-semibold text-foreground">
            {plan.name}
          </span>
        </div>
        <div className="text-right">
          <div className="flex items-baseline gap-0.5">
            <span className="font-heading text-3xl font-bold text-foreground">
              ${price}
            </span>
            <span className="text-xs text-muted-foreground">/mo</span>
          </div>
          {yearly && plan.monthly > 0 && (
            <span className="text-xs text-muted-foreground/60 line-through">
              ${plan.monthly}/mo
            </span>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>

      {/* Divider */}
      <div className="my-6 h-px w-full bg-border" />

      {/* Features */}
      <ul className="flex flex-col gap-3">
        {plan.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2.5 text-sm text-muted-foreground"
          >
            <Check
              className={cn(
                "mt-0.5 size-3.5 shrink-0",
                plan.featured ? "text-brand" : "text-muted-foreground",
              )}
              strokeWidth={2.5}
            />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        asChild
        className={cn(
          "mt-8 flex w-full items-center justify-between rounded-xl px-5 py-5 text-sm font-semibold shadow-none",
          plan.featured
            ? "bg-brand text-brand-foreground hover:bg-brand/90"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        )}
      >
        <Link href="/sign-up">
          {plan.cta}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="w-full bg-background py-28">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-14 px-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-5 text-center">
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="font-heading max-w-lg text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Pay for leverage,
            <br className="hidden sm:block" /> not listings
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Start free and upgrade when you&apos;re ready for the full toolkit.
            No hidden fees.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-1 rounded-full border border-white/[0.07] bg-card p-1">
          {[false, true].map((isYearly) => (
            <button
              key={String(isYearly)}
              onClick={() => setYearly(isYearly)}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors",
                yearly === isYearly
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isYearly ? "Yearly" : "Monthly"}
              {isYearly && (
                <Badge className="rounded-full bg-brand/20 px-2 py-0 text-[10px] font-bold text-brand">
                  Save 25%
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} yearly={yearly} />
          ))}
        </div>
      </div>
    </section>
  );
}
