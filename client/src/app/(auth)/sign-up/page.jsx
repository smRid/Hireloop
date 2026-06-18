"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Search, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import GoogleAuth from "@/components/auth/GoogleAuth";

/* ── "or continue with email" divider ────────────────────────────── */
function OrDivider() {
  return (
    <div className="flex items-center gap-3" role="separator" aria-label="or">
      <div className="h-px flex-1 bg-border" />
      <span className="font-sans text-[12px] text-muted-foreground whitespace-nowrap">
        or continue with email
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

/* ── Labelled input wrapper ──────────────────────────────────────── */
function FormField({ id, label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-sans text-[13px] font-medium text-foreground"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="font-sans text-[12px] text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Base input class ────────────────────────────────────────────── */
const inputBase = cn(
  "h-11 w-full rounded-xl border border-border bg-popover px-3.5",
  "font-sans text-[14px] text-foreground placeholder:text-muted-foreground",
  "outline-none transition-colors duration-150",
  "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
  "disabled:opacity-50 disabled:cursor-not-allowed",
);

/* ── Password input with show/hide toggle ────────────────────────── */
function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete,
  hasError,
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={hasError || undefined}
        className={cn(
          inputBase,
          "pr-11",
          hasError && "border-destructive focus-visible:ring-destructive/30",
        )}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2",
          "flex size-6 items-center justify-center rounded-md",
          "text-muted-foreground transition-colors hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

/* ── Role selector cards ─────────────────────────────────────────── */
const ROLES = [
  {
    value: "seeker",
    label: "Job Seeker",
    description: "Find and apply to your next role",
    Icon: Search,
  },
  {
    value: "recruiter",
    label: "Recruiter",
    description: "Post jobs and find top talent",
    Icon: Briefcase,
  },
];

function RoleSelector({ value, onChange, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-sans text-[13px] font-medium text-foreground">
        I am a…
      </span>
      <div
        role="radiogroup"
        aria-label="Select your role"
        className="grid grid-cols-2 gap-3"
      >
        {ROLES.map(({ value: rv, label, description, Icon }) => {
          const isActive = value === rv;
          return (
            <button
              key={rv}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(rv)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-xl border p-4",
                "text-left transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? [
                      "border-primary bg-primary/8",
                      "shadow-[0_0_0_1px_var(--primary)]",
                    ]
                  : [
                      "border-border bg-popover",
                      "hover:border-primary/50 hover:bg-popover",
                    ],
              )}
            >
              {/* Icon container */}
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg",
                  "transition-colors duration-150",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
                aria-hidden="true"
              >
                <Icon className="size-4" />
              </span>

              <span className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    "font-sans text-[13px] font-semibold leading-snug",
                    isActive ? "text-foreground" : "text-foreground",
                  )}
                >
                  {label}
                </span>
                <span className="font-sans text-[12px] leading-snug text-muted-foreground">
                  {description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="font-sans text-[12px] text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Terms checkbox ──────────────────────────────────────────────── */
function TermsCheckbox({ checked, onChange, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex cursor-pointer items-start gap-2.5 group">
        {/* Custom checkbox */}
        <span
          className={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors duration-150",
            checked
              ? "border-primary bg-primary"
              : "border-border bg-popover group-hover:border-primary/60",
          )}
          aria-hidden="true"
        >
          {checked && (
            <svg
              viewBox="0 0 10 10"
              className="size-2.5 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1.5,5 4,7.5 8.5,2.5" />
            </svg>
          )}
        </span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          aria-label="I agree to the Terms of Service and Privacy Policy"
        />
        <span className="font-sans text-[13px] leading-relaxed text-muted-foreground">
          I agree to the{" "}
          <Link
            href="/terms"
            className="text-primary underline-offset-2 hover:underline"
            tabIndex={0}
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-primary underline-offset-2 hover:underline"
            tabIndex={0}
          >
            Privacy Policy
          </Link>
        </span>
      </label>
      {error && (
        <p className="font-sans text-[12px] text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Sign Up page ────────────────────────────────────────────────── */
export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("seeker");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!name.trim()) e.name = "Full name is required.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 8)
      e.password = "Password must be at least 8 characters.";
    if (!role) e.role = "Please select a role.";
    if (!agreed) e.terms = "You must accept the terms to continue.";
    return e;
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    /* TODO: call auth endpoint */
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* ── Left: branding panel ── */}
      <AuthBrandPanel />

      {/* ── Right: form panel ── */}
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center",
          "bg-background px-5 py-12 lg:w-1/2",
          /* Allow vertical scroll if form overflows on small screens */
          "overflow-y-auto",
        )}
      >
        {/* Mobile logo */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-2.5 select-none lg:hidden"
          aria-label="Seekcruitr home"
        >
          <svg
            width="24"
            height="24"
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
            <clipPath id="mobile-sign-up-logo">
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
              clipPath="url(#mobile-sign-up-logo)"
            />
          </svg>
          <span className="font-heading text-[22px] font-bold leading-none text-foreground">
            Seekcruitr
          </span>
        </Link>

        {/* Form card */}
        <div className="w-full max-w-100">
          {/* Heading */}
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="font-heading text-[28px] font-bold leading-tight text-foreground">
              Create your account
            </h1>
            <p className="font-sans text-[14px] text-muted-foreground">
              Start your journey — it only takes a minute.
            </p>
          </div>

          {/* Google SSO */}
          <GoogleAuth />

          {/* Divider */}
          <div className="mb-5">
            <OrDivider />
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            {/* Full name */}
            <FormField id="name" label="Full name" error={errors.name}>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                autoComplete="name"
                aria-invalid={!!errors.name}
                className={cn(
                  inputBase,
                  errors.name &&
                    "border-destructive focus-visible:ring-destructive/30",
                )}
              />
            </FormField>

            {/* Email */}
            <FormField id="email" label="Email address" error={errors.email}>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className={cn(
                  inputBase,
                  errors.email &&
                    "border-destructive focus-visible:ring-destructive/30",
                )}
              />
            </FormField>

            {/* Password */}
            <FormField id="password" label="Password" error={errors.password}>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                hasError={!!errors.password}
              />
            </FormField>

            {/* Role selector */}
            <RoleSelector
              value={role}
              onChange={(v) => {
                setRole(v);
                setErrors((prev) => ({ ...prev, role: undefined }));
              }}
              error={errors.role}
            />

            {/* Terms */}
            <TermsCheckbox
              checked={agreed}
              onChange={(v) => {
                setAgreed(v);
                setErrors((prev) => ({ ...prev, terms: undefined }));
              }}
              error={errors.terms}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl",
                "bg-primary text-primary-foreground",
                "font-heading text-[16px] font-semibold",
                "transition-all duration-150",
                "hover:bg-primary/90",
                "hover:shadow-[0_4px_20px_-2px_color-mix(in_oklch,var(--primary)_35%,transparent)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none",
              )}
            >
              {loading ? (
                <span className="flex items-center gap-2">
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
                  Creating account…
                </span>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="size-4" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center font-sans text-[14px] text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className={cn(
                "font-medium text-primary underline-offset-2",
                "hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
              )}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
