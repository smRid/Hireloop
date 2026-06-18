import { cn } from "@/lib/utils";
import { Star, Zap } from "lucide-react";
import FeatureRow from "./FeatureRow";
import Link from "next/link";

const PricingCard = ({ plan }) => {
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
};

export default PricingCard;
