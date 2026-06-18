import Link from "next/link";
import BrandMark from "@/components/shared/BrandMark";
import { cn } from "@/lib/utils";

/* ── Social proof stat pill ──────────────────────────────────────── */
function StatPill({ children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1",
        "border border-primary/25 bg-primary/10",
        "font-sans text-[12px] font-medium text-primary",
      )}
    >
      {children}
    </span>
  );
}

/* ── Decorative dot grid — mirrors HeroSection ───────────────────── */
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
        opacity="0.03"
      />
    </svg>
  );
}

/* ── Left branding panel ─────────────────────────────────────────── */
export default function AuthBrandPanel() {
  return (
    <div
      className={cn(
        /* Full height, half-width, hidden on mobile */
        "relative hidden lg:flex lg:w-1/2",
        "flex-col items-center justify-center overflow-hidden",
        "bg-popover border-r border-border",
      )}
      aria-hidden="true" /* Decorative — screen readers get the form */
    >
      {/* ── Dot grid texture ── */}
      <DotGrid />

      {/* ── Teal radial glow — bottom-left ── */}
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-120 w-120 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 12%, transparent), transparent 70%)",
        }}
      />

      {/* ── Secondary glow — top-right, dimmer ── */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-[320px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 5%, transparent), transparent 70%)",
        }}
      />

      {/* ── Content stack ── */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-10 px-10 text-center">
        {/* Logo + wordmark */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 select-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
          )}
          tabIndex={-1} /* Panel is aria-hidden; remove from tab order */
        >
          {/* Larger BrandMark for the auth panel */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 20 20"
            fill="none"
            className="shrink-0"
            style={{
              "--mark-top": "var(--primary)",
              "--mark-bottom": "var(--ring)",
            }}
          >
            <rect
              x="3"
              y="3"
              width="14"
              height="14"
              rx="1"
              transform="rotate(45 10 10)"
              fill="var(--mark-top)"
            />
            <clipPath id="auth-brand-bottom">
              <rect x="0" y="10" width="20" height="10" />
            </clipPath>
            <rect
              x="3"
              y="3"
              width="14"
              height="14"
              rx="1"
              transform="rotate(45 10 10)"
              fill="var(--mark-bottom)"
              style={{ opacity: 0.65 }}
              clipPath="url(#auth-brand-bottom)"
            />
          </svg>
          <span className="font-heading text-[28px] font-bold leading-none text-foreground tracking-tight">
            Seekcruitr
          </span>
        </Link>

        {/* Tagline / quote */}
        <div className="flex flex-col gap-3">
          <p className="font-heading text-[32px] font-bold leading-snug text-primary">
            Your next great
            <br />
            role is one
            <br />
            search away.
          </p>
          <p className="font-sans text-[15px] leading-relaxed text-muted-foreground">
            Join over 2 million professionals who found their dream job through
            Seekcruitr.
          </p>
        </div>

        {/* Social proof stats */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <StatPill>50K Jobs</StatPill>
          <StatPill>12K Companies</StatPill>
          <StatPill>2M Seekers</StatPill>
        </div>
      </div>

      {/* ── Bottom attribution ── */}
      <p className="absolute bottom-6 font-sans text-[12px] text-muted-foreground/50">
        © {new Date().getFullYear()} Seekcruitr. All rights reserved.
      </p>
    </div>
  );
}
