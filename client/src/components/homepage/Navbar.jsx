"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import BrandMark from "@/components/shared/BrandMark";
import useCurrentUser from "@/lib/core/use-current-user";
import NavLink from "./navbar/NavLink";
import GuestButtons from "./navbar/GuestButtons";
import UserMenu from "./navbar/UserMenu";
import MobileAuthSection from "./navbar/MobileAuthSection";

const NAV_LINKS = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const session = useCurrentUser();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = !!session?.user;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full h-16",
          "border-b border-border/80 bg-card/90 shadow-[0_1px_0_color-mix(in_oklch,var(--foreground)_4%,transparent)]",
          "backdrop-blur-xl",
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2.5 select-none"
            aria-label="Hireloop home"
          >
            <BrandMark />
            <span className="font-heading text-[22px] font-bold leading-none text-foreground">
              Hireloop
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 md:flex"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <NavLink
                key={href}
                href={href}
                isActive={pathname === href || pathname.startsWith(href + "/")}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ── Desktop right section ── */}
          <div className="hidden items-center md:flex">
            {isLoggedIn ? <UserMenu session={session} /> : <GuestButtons />}
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
          "sticky top-16 z-40 w-full overflow-hidden border-b border-border/80 bg-card/95 shadow-lg shadow-black/10 backdrop-blur-xl md:hidden",
          "transition-all duration-300 ease-in-out",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {NAV_LINKS.map(({ label, href }) => (
            <NavLink
              key={href}
              href={href}
              isActive={pathname === href || pathname.startsWith(href + "/")}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </NavLink>
          ))}

          <MobileAuthSection
            session={isLoggedIn ? session : null}
            onClose={() => setMobileOpen(false)}
          />
        </div>
      </div>
    </>
  );
}
