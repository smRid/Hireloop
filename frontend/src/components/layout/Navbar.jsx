"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar({ className }) {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-4 z-50 flex justify-center px-4",
        className,
      )}
    >
      <nav
        aria-label="Main navigation"
        className="flex w-full max-w-5xl items-center justify-between gap-8 rounded-2xl border border-white/[0.07] bg-card/80 px-5 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl"
      >
        {/* Logo */}
        <Link href="/" aria-label="Seekcruitr home" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Seekcruitr"
            width={120}
            height={32}
            className="h-7 w-auto object-contain"
            priority
          />
        </Link>

        {/* Nav links */}
        <ul className="hidden items-center gap-0.5 md:flex" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth */}
        <div className="flex items-center gap-2">
          <Separator orientation="vertical" className="hidden h-5 md:block" />
          <Link
            href="/sign-in"
            className="hidden rounded-lg px-3.5 py-2 text-sm font-medium text-brand transition-colors hover:text-brand/80 md:block"
          >
            Sign In
          </Link>
          <Button
            asChild
            size="sm"
            className="rounded-xl bg-brand px-4 font-heading font-semibold text-brand-foreground shadow-none hover:bg-brand/90"
          >
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
