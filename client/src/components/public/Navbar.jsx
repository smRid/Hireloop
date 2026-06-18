"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import BrandMark from "@/components/shared/BrandMark";
import { signOut, useSession } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const NAV_LINKS = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
];

/* ── Role → dashboard href ──────────────────────────────────────── */
function dashboardHref(role) {
  if (role === "recruiter") return "/dashboard/recruiter";
  if (role === "admin") return "/dashboard/admin";
  return "/dashboard/seeker";
}

/* ── Derive initials from a full name ───────────────────────────── */
function nameInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ── NavLink with slide-in teal underline + active state ───────── */
function NavLink({ href, children, onClick, isActive }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative inline-block text-[14px]",
        "transition-colors duration-200",
        /* Active: foreground text + underline permanently visible */
        isActive
          ? "text-foreground after:scale-x-100"
          : "text-muted-foreground hover:text-foreground after:scale-x-0 hover:after:scale-x-100",
        "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full",
        "after:origin-left after:rounded-full",
        "after:bg-primary after:transition-transform after:duration-300",
      )}
    >
      {children}
    </Link>
  );
}

/* ════════════════════════════════════════════════════════════════════
   AVATAR — circular with initials fallback
   ════════════════════════════════════════════════════════════════════ */

function Avatar({ name, image, size = 36 }) {
  const initials = nameInitials(name);
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-secondary",
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {image ? (
        <Image
          src={image}
          alt={name}
          width={size}
          height={size}
          className="size-full object-cover"
        />
      ) : (
        <span className="font-heading text-[13px] font-semibold leading-none text-foreground">
          {initials}
        </span>
      )}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════
   GUEST BUTTONS
   ════════════════════════════════════════════════════════════════════ */

function GuestButtons({ onClose }) {
  return (
    <div className="flex items-center gap-2">
      {/* Sign In — ghost */}
      <Link
        href="/sign-in"
        onClick={onClose}
        className={cn(
          "inline-flex h-9 items-center justify-center rounded-lg border border-border",
          "bg-transparent px-4",
          "font-sans text-[14px] font-medium text-foreground",
          "transition-colors duration-150",
          "hover:bg-secondary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        Sign In
      </Link>

      {/* Get Started — primary */}
      <Link
        href="/sign-up"
        onClick={onClose}
        className={cn(
          "inline-flex h-9 items-center justify-center rounded-lg",
          "bg-primary px-4",
          "font-sans text-[14px] font-medium text-primary-foreground",
          "transition-opacity duration-150 hover:opacity-90",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        Get Started
      </Link>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   USER DROPDOWN MENU
   ════════════════════════════════════════════════════════════════════ */

function UserMenu({ session }) {
  const user = session?.user ?? {};
  const role = user.role ?? "seeker";
  const name = user.name ?? "";
  const email = user.email ?? "";
  const image = user.image ?? null;

  /* Role label */
  const roleLabel =
    role === "recruiter" ? "Recruiter" : role === "admin" ? "Admin" : "Seeker";

  return (
    <DropdownMenu>
      {/* ── Trigger: avatar circle ── */}
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open user menu"
          className={cn(
            "rounded-full cursor-pointer",
            "outline-none",
            "ring-offset-background ring-offset-2",
            "transition-shadow duration-150",
            "hover:ring-2 hover:ring-primary",
            "focus-visible:ring-2 focus-visible:ring-primary",
          )}
        >
          <Avatar name={name} image={image} size={36} />
        </button>
      </DropdownMenuTrigger>

      {/* ── Dropdown panel ── */}
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(
          "w-55 min-w-55",
          "rounded-xl border border-border bg-card p-1.5",
          "shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)]",
          /* Entrance animation — fade + slide up */
          "data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-1",
          "data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-top-1",
          "duration-150",
        )}
      >
        {/* ── Non-clickable user info block ── */}
        <div className="border-b border-border pb-1.5 mb-1.5">
          <div className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5")}>
            {/* 32px avatar */}
            <Avatar name={name} image={image} size={32} />

            {/* Name + email + role badge */}
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate font-sans text-[14px] font-medium leading-snug text-foreground">
                {name || "User"}
              </span>
              <span className="truncate font-sans text-[12px] leading-snug text-muted-foreground">
                {email}
              </span>
              <span className="font-sans text-[10px] font-medium uppercase tracking-wider text-primary">
                {roleLabel}
              </span>
            </div>
          </div>
        </div>

        {/* ── Menu items ── */}

        {/* Dashboard */}
        <DropdownMenuItem asChild>
          <Link
            href={dashboardHref(role)}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2",
              "font-sans text-[14px] text-foreground",
              "transition-colors hover:bg-secondary",
              "focus-visible:outline-none focus-visible:bg-secondary",
            )}
          >
            <LayoutDashboard
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            Dashboard
          </Link>
        </DropdownMenuItem>

        {/* My Profile */}
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/seeker"
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2",
              "font-sans text-[14px] text-foreground",
              "transition-colors hover:bg-secondary",
              "focus-visible:outline-none focus-visible:bg-secondary",
            )}
          >
            <User
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            My Profile
          </Link>
        </DropdownMenuItem>

        {/* Settings */}
        <DropdownMenuItem asChild>
          <Link
            href={`${dashboardHref(role)}/settings`}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2",
              "font-sans text-[14px] text-foreground",
              "transition-colors hover:bg-secondary",
              "focus-visible:outline-none focus-visible:bg-secondary",
            )}
          >
            <Settings
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        {/* Sign Out */}
        <DropdownMenuItem asChild>
          <button
            type="button"
            onClick={() => {
              signOut();
            }}
            className={cn(
              "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2",
              "font-sans text-[14px] text-destructive",
              "transition-colors hover:bg-destructive/10",
              "focus-visible:outline-none focus-visible:bg-destructive/10",
            )}
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            Sign Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MOBILE DRAWER AUTH SECTION
   ════════════════════════════════════════════════════════════════════ */

function MobileAuthSection({ session, onClose }) {
  const user = session?.user ?? {};
  const role = user.role ?? "seeker";
  const name = user.name ?? "";
  const email = user.email ?? "";
  const image = user.image ?? null;
  const roleLabel =
    role === "recruiter" ? "Recruiter" : role === "admin" ? "Admin" : "Seeker";

  if (!session) {
    return (
      <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
        <Link
          href="/sign-in"
          onClick={onClose}
          className={cn(
            "flex h-10 w-full items-center justify-center rounded-lg border border-border",
            "bg-transparent font-sans text-[14px] font-medium text-foreground",
            "hover:bg-secondary transition-colors",
          )}
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          onClick={onClose}
          className={cn(
            "flex h-10 w-full items-center justify-center rounded-lg",
            "bg-primary font-sans text-[14px] font-medium text-primary-foreground",
            "hover:opacity-90 transition-opacity",
          )}
        >
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-3 border-t border-border pt-3">
      {/* User info mini row */}
      <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 bg-popover">
        <Avatar name={name} image={image} size={32} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate font-sans text-[14px] font-medium text-foreground">
            {name || "User"}
          </span>
          <span className="truncate font-sans text-[11px] text-muted-foreground">
            {roleLabel}
          </span>
        </div>
      </div>

      {/* Quick links */}
      <div className="flex flex-col gap-0.5">
        <Link
          href={dashboardHref(role)}
          onClick={onClose}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-[14px] text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <LayoutDashboard className="size-4 shrink-0" aria-hidden="true" />
          Dashboard
        </Link>
        <Link
          href={`${dashboardHref(role)}/settings`}
          onClick={onClose}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-[14px] text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <Settings className="size-4 shrink-0" aria-hidden="true" />
          Settings
        </Link>
        <button
          type="button"
          onClick={() => {
            signOut();
            onClose();
          }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-[14px] text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="size-4 shrink-0" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN NAVBAR
   ════════════════════════════════════════════════════════════════════ */

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = !!session?.user;

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
          "sticky top-16 z-40 w-full overflow-hidden border-b border-border bg-card backdrop-blur-md md:hidden",
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
