"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
];

/* ── Geometric diamond mark ──────────────────────────────────────── */
function BrandMark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
      style={{
        "--mark-top": "var(--primary)",
        "--mark-bottom": "var(--ring)",
      }}
    >
      {/* Square rotated 45° — top half: brand teal (--primary) */}
      <rect
        x="3"
        y="3"
        width="14"
        height="14"
        rx="1"
        transform="rotate(45 10 10)"
        fill="var(--mark-top)"
      />
      {/* Bottom-half darker teal — diagonal split via clipPath */}
      <clipPath id="brand-mark-bottom">
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
        clipPath="url(#brand-mark-bottom)"
      />
    </svg>
  );
}

/* ── NavLink with slide-in teal underline ────────────────────────── */
function NavLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative inline-block text-[14px] text-muted-foreground transition-colors duration-200 hover:text-foreground",
        "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full",
        "after:origin-left after:scale-x-0 after:rounded-full",
        "after:bg-primary after:transition-transform after:duration-300",
        "hover:after:scale-x-100",
      )}
    >
      {children}
    </Link>
  );
}

/* ── Main Navbar ─────────────────────────────────────────────────── */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full h-16",
          "bg-card border-b border-border",
          "backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2.5 select-none"
            aria-label="Seekcruitr home"
          >
            <BrandMark />
            <span className="font-heading text-[22px] font-bold leading-none text-foreground tracking-tight">
              Seekcruitr
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 md:flex"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <NavLink key={href} href={href}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ── Desktop CTA ── */}
          <div className="hidden items-center gap-3 md:flex">
            <Button
              asChild
              variant="ghost"
              className="h-9 px-4 text-[14px] font-medium text-muted-foreground hover:text-foreground"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button
              asChild
              variant="default"
              className="h-9 rounded-md px-5 text-[14px] font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground transition-colors md:hidden"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <div
        id="mobile-nav"
        role="navigation"
        aria-label="Mobile navigation"
        className={cn(
          "sticky top-16 z-40 w-full overflow-hidden border-b border-border bg-card backdrop-blur-md md:hidden",
          "transition-all duration-300 ease-in-out",
          mobileOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2.5 text-[14px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {label}
            </Link>
          ))}

          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            <Button
              asChild
              variant="ghost"
              className="h-10 w-full justify-center text-[14px] font-medium text-muted-foreground hover:text-foreground"
            >
              <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button
              asChild
              variant="default"
              className="h-10 w-full justify-center rounded-md text-[14px] font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
