"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Briefcase, Check, ArrowRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { setRole } from "@/services/users.service";

/* ════════════════════════════════════════════════════════════════════
   MOCK — replace with real session from auth provider
   ════════════════════════════════════════════════════════════════════ */

const MOCK_EMAIL = "jordan.rivera@gmail.com";

/* ════════════════════════════════════════════════════════════════════
   ROLE OPTIONS
   ════════════════════════════════════════════════════════════════════ */

const ROLES = [
  {
    id: "seeker",
    title: "I'm looking for a job",
    subtitle: "Browse jobs, apply, and track your applications.",
    icon: Search,
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
    href: "/dashboard/seeker",
  },
  {
    id: "recruiter",
    title: "I'm hiring talent",
    subtitle: "Post jobs, manage applicants, and grow your team.",
    icon: Briefcase,
    iconBg: "bg-chart-2/15",
    iconColor: "text-chart-2",
    href: "/dashboard/recruiter",
  },
];

/* ════════════════════════════════════════════════════════════════════
   SELECTION INDICATOR
   ════════════════════════════════════════════════════════════════════ */

function SelectionCircle({ selected }) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
        "transition-all duration-150",
        selected ? "border-primary bg-primary" : "border-border bg-transparent",
      )}
      aria-hidden="true"
    >
      {selected && (
        <Check
          className="size-3 text-primary-foreground"
          strokeWidth={3}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ROLE CARD
   ════════════════════════════════════════════════════════════════════ */

function RoleCard({ role, selected, onSelect }) {
  const Icon = role.icon;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={role.title}
      onClick={() => onSelect(role.id)}
      className={cn(
        /* Base */
        "flex w-full cursor-pointer items-center gap-4 rounded-xl border p-6 text-left",
        "transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        /* Default state */
        selected
          ? [
              "border-primary bg-primary/8",
              "scale-[1.01]",
              "shadow-[0_4px_20px_-4px_color-mix(in_oklch,var(--primary)_15%,transparent)]",
            ]
          : [
              "border-border bg-secondary",
              "hover:border-primary/40 hover:bg-primary/3",
            ],
      )}
    >
      {/* Icon block */}
      <span
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-lg",
          role.iconBg,
        )}
        aria-hidden="true"
      >
        <Icon className={cn("size-6", role.iconColor)} strokeWidth={1.75} />
      </span>

      {/* Text block */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-heading text-[16px] font-semibold leading-snug text-foreground">
          {role.title}
        </span>
        <span className="font-sans text-[13px] leading-snug text-muted-foreground">
          {role.subtitle}
        </span>
      </div>

      {/* Selection indicator */}
      <SelectionCircle selected={selected} />
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */

export default function OnboardingPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedRole = ROLES.find((r) => r.id === selected);

  async function handleContinue() {
    if (!selectedRole || loading) return;
    setLoading(true);
    await setRole({ role: selected, userId: user.id });
    setTimeout(() => {
      router.push(selectedRole.href);
    }, 800);
  }

  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center",
        "bg-background px-4 py-12",
      )}
    >
      {/* ── Radial teal glow — decorative ── */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center",
        )}
        aria-hidden="true"
      >
        <div className="h-150 w-150 rounded-full bg-primary/6 blur-3xl" />
      </div>

      {/* ════════════════════════════════════════════════════════
          ABOVE-CARD: logo + step indicator
          ════════════════════════════════════════════════════════ */}
      <div className="relative z-10 mb-8 flex flex-col items-center gap-3">
        {/* BrandMark + wordmark */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 select-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
          )}
          aria-label="Hireloop home"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
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
            <clipPath id="onboarding-brand-clip">
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
              clipPath="url(#onboarding-brand-clip)"
            />
          </svg>
          <span className="font-heading text-[22px] font-bold leading-none tracking-tight text-foreground">
            Hireloop
          </span>
        </Link>

        {/* Step indicator */}
        <p className="font-sans text-[12px] text-muted-foreground">
          Step 1 of 1
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════
          MAIN CARD
          ════════════════════════════════════════════════════════ */}
      <div
        className={cn(
          "relative z-10 w-full max-w-130",
          "rounded-2xl border border-border bg-card",
          "px-12 py-12",
        )}
      >
        {/* Heading */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <h1 className="font-heading text-[28px] font-bold leading-tight text-foreground">
            How will you use Hireloop?
          </h1>
          <p className="font-sans text-[14px] leading-relaxed text-muted-foreground">
            Choose your role.{" "}
            <span className="font-medium text-foreground">
              You can&rsquo;t change this later.
            </span>
          </p>
        </div>

        {/* Role cards */}
        <div
          className="flex flex-col gap-3"
          role="radiogroup"
          aria-label="Choose your role"
        >
          {ROLES.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              selected={selected === role.id}
              onSelect={setSelected}
            />
          ))}
        </div>

        {/* Continue button */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selected || loading}
          aria-label={
            !selected
              ? "Select a role to continue"
              : `Continue to dashboard as ${selectedRole?.title}`
          }
          className={cn(
            "mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl",
            "bg-primary text-primary-foreground",
            "font-heading text-[16px] font-semibold",
            "transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            selected && !loading
              ? [
                  "hover:opacity-90",
                  "hover:shadow-[0_4px_24px_-4px_color-mix(in_oklch,var(--primary)_40%,transparent)]",
                ]
              : "opacity-40 cursor-not-allowed",
          )}
        >
          {loading ? (
            <>
              <svg
                className="size-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-25"
                />
                <path
                  d="M4 12a8 8 0 018-8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="opacity-75"
                />
              </svg>
              Setting up your account…
            </>
          ) : (
            <>
              Continue to Dashboard
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </button>

        {/* Bottom note */}
        <p className="mt-6 text-center font-sans text-[12px] text-muted-foreground">
          Signed in as{" "}
          <span className="font-medium text-foreground">{MOCK_EMAIL}</span>
          {"  ·  "}
          <a
            href="/sign-in"
            className={cn(
              "font-medium text-primary underline-offset-2 hover:underline",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
            )}
          >
            Not you? Sign out
          </a>
        </p>
      </div>
    </div>
  );
}
