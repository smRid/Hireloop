"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar({ className }) {
  return (
    <header className={cn("fixed inset-x-0 top-4 z-50 flex justify-center px-4", className)}>
      <nav
        aria-label="Main navigation"
        className="flex w-full max-w-5xl items-center justify-between rounded-xl bg-popover px-5 py-2.5 shadow-lg ring-1 ring-border backdrop-blur-md"
      >
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" aria-label="Seekcruitr home">
          <Image
            src="/logo.png"
            alt="hireloop"
            width={120}
            height={32}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Nav links */}
        <ul className="flex items-center gap-1" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="font-sans rounded-md px-3 py-1.5 text-sm font-medium text-popover-foreground/70 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth actions */}
        <div className="flex items-center gap-3">
          {/* Separator */}
          <div className="h-5 w-px bg-border" aria-hidden="true" />

          <Link
            href="/sign-in"
            className="font-sans text-sm font-medium text-brand transition-colors hover:text-brand/80"
          >
            Sign In
          </Link>

          <Button
            asChild
            className="font-heading bg-brand text-brand-foreground hover:bg-brand/90 h-8 rounded-lg px-4 text-sm font-semibold shadow-none"
          >
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
