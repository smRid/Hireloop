import Link from "next/link";
import BrandMark from "@/components/shared/BrandMark";
import { cn } from "@/lib/utils";

function StatPill({ children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1",
        "border border-border/80 bg-card/70",
        "font-sans text-[12px] font-medium text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

function DotGrid() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="auth-dot-grid"
          x="0"
          y="0"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.5" cy="1.5" r="1.5" fill="var(--foreground)" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#auth-dot-grid)"
        opacity="0.025"
      />
    </svg>
  );
}

export default function AuthBrandPanel() {
  return (
    <div
      className={cn(
        "relative hidden overflow-hidden border-r border-border/80 bg-popover/80",
        "shadow-2xl shadow-black/20 lg:flex lg:w-1/2",
        "flex-col items-center justify-center",
      )}
      aria-hidden="true"
    >
      <DotGrid />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-10 px-10 text-center">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 select-none",
            "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
          tabIndex={-1}
        >
          <BrandMark />
          <span className="font-heading text-[28px] font-bold leading-none text-foreground">
            Hireloop
          </span>
        </Link>

        <div className="flex flex-col gap-3">
          <p className="font-heading text-[32px] font-bold leading-snug text-foreground">
            Hiring clarity for
            <br />
            modern teams and
            <br />
            ambitious talent.
          </p>
          <p className="font-sans text-[15px] leading-relaxed text-muted-foreground">
            A focused workspace for finding roles, managing applications, and
            building stronger hiring relationships.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <StatPill>50K Jobs</StatPill>
          <StatPill>12K Companies</StatPill>
          <StatPill>2M Seekers</StatPill>
        </div>
      </div>

      <p className="absolute bottom-6 font-sans text-[12px] text-muted-foreground/60">
        (c) {new Date().getFullYear()} Hireloop. All rights reserved.
      </p>
    </div>
  );
}
