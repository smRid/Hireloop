"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import GoogleAuth from "@/components/auth/GoogleAuth";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

/* ── Google logo SVG (official brand colours) ────────────────────── */
function GoogleLogo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

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

/* ── Base input styles ───────────────────────────────────────────── */
const inputBase = cn(
  "h-11 w-full rounded-xl border border-border bg-popover px-3.5",
  "font-sans text-[14px] text-foreground placeholder:text-muted-foreground",
  "outline-none transition-colors duration-150",
  "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
  "disabled:opacity-50 disabled:cursor-not-allowed",
);

/* ── Password input with show/hide toggle ────────────────────────── */
function PasswordInput({ id, value, onChange, placeholder, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name={"password"}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(inputBase, "pr-11")}
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

/* ── Sign In form ────────────────────────────────────────────────── */
export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 8)
      e.password = "Password must be at least 8 characters.";
    return e;
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const payload = {
        ...Object.fromEntries(new FormData(evt.currentTarget)),
      };
      console.log(payload);

      const { error } = await signIn.email(payload);

      if (error) {
        setErrors({ email: error });
        console.error(error);
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Full-viewport two-column shell */
    <div className="flex min-h-screen w-full">
      {/* ── Left: branding panel ── */}
      <AuthBrandPanel />

      {/* ── Right: form panel ── */}
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center",
          "bg-background px-5 py-12 lg:w-1/2",
        )}
      >
        {/* Mobile logo — only shows when left panel is hidden */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-2.5 select-none lg:hidden"
          aria-label="Hireloop home"
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
            <clipPath id="mobile-sign-in-logo">
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
              clipPath="url(#mobile-sign-in-logo)"
            />
          </svg>
          <span className="font-heading text-[22px] font-bold leading-none text-foreground">
            Hireloop
          </span>
        </Link>

        {/* Form card */}
        <div className="w-full max-w-100">
          {/* Heading */}
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="font-heading text-[28px] font-bold leading-tight text-foreground">
              Welcome back
            </h1>
            <p className="font-sans text-[14px] text-muted-foreground">
              Sign in to your Hireloop account.
            </p>
          </div>

          {/* Google SSO */}
          <GoogleAuth />

          {/* Divider */}
          <div className="mb-5">
            <OrDivider />
          </div>

          {/* Email + password form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <FormField id="email" label="Email address" error={errors.email}>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={cn(
                  inputBase,
                  errors.email &&
                    "border-destructive focus-visible:ring-destructive/30",
                )}
              />
            </FormField>

            <FormField id="password" label="Password" error={errors.password}>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {/* Forgot password — right-aligned below the field */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className={cn(
                    "font-sans text-[12px] text-primary underline-offset-2",
                    "hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
                  )}
                >
                  Forgot password?
                </Link>
              </div>
            </FormField>

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
                  Signing in…
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="size-4" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center font-sans text-[14px] text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className={cn(
                "font-medium text-primary underline-offset-2",
                "hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
              )}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
