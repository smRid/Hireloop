import {
  Search,
  TrendingUp,
  Building2,
  Bookmark,
  Zap,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import FeatureItem from "./features-section/FeatureItem";

const FEATURES = [
  {
    icon: Search,
    label: "Smart Search",
    description:
      "AI-powered search understands your skills and intent — not just keywords — to surface the most relevant roles.",
  },
  {
    icon: TrendingUp,
    label: "Salary Insights",
    description:
      "See real compensation ranges sourced from verified offers so you always negotiate from a position of knowledge.",
  },
  {
    icon: Building2,
    label: "Top Companies",
    description:
      "Explore curated employer profiles with culture scores, team size, and growth trajectory at a glance.",
  },
  {
    icon: Bookmark,
    label: "Saved Jobs",
    description:
      "Bookmark roles you love and revisit them anytime. Kiro will alert you when a saved job is about to close.",
  },
  {
    icon: Zap,
    label: "One-Click Apply",
    description:
      "Your profile pre-fills every application. Apply to roles you're excited about in seconds, not minutes.",
  },
  {
    icon: FileText,
    label: "Resume Builder",
    description:
      "Craft a standout resume with guided templates optimised for ATS systems used by top-tier employers.",
  },
];

/* ── Horizontal teal gradient top border ──────────────────────────── */
function GradientTopBorder() {
  return (
    <div
      className="absolute inset-x-0 top-0 h-px"
      style={{
        background:
          "linear-gradient(to right, transparent, var(--primary), transparent)",
      }}
      aria-hidden="true"
    />
  );
}

/* ── Section ───────────────────────────────────────────────────────── */
export default function FeaturesSection() {
  return (
    <section
      className="relative w-full border-y border-border/60 bg-card/80 px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="features-heading"
    >
      {/* Horizontal teal gradient border at the top edge */}
      <GradientTopBorder />

      <div className="mx-auto max-w-7xl">
        {/* ── Section header ── */}
        <div className="mb-16 flex flex-col items-center gap-3 text-center">
          <span
            className="font-sans text-[12px] font-medium uppercase tracking-widest text-primary"
            aria-hidden="true"
          >
            Everything You Need
          </span>
          <h2
            id="features-heading"
            className="font-heading text-[36px] font-semibold leading-tight text-foreground sm:text-[40px]"
          >
            Built for Modern Job Seekers
          </h2>
          <p className="max-w-120 font-sans text-[16px] leading-relaxed text-muted-foreground">
            Every tool you need to find, apply, and land the role you deserve —
            all in one place.
          </p>
        </div>

        {/* ── 6-item grid ── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon, label, description }) => (
            <FeatureItem
              key={label}
              icon={icon}
              label={label}
              description={description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
