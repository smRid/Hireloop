"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNavByRole } from "@/constants/nav-links";

/* ── Role badge colours ──────────────────────────────────────────── */
const ROLE_BADGE = {
  seeker: { label: "Seeker", cls: "bg-primary/10 text-primary" },
  recruiter: { label: "Recruiter", cls: "bg-primary/10 text-primary" },
  admin: { label: "Admin", cls: "bg-primary/10 text-primary" },
};

/* ── Plan badge ──────────────────────────────────────────────────── */
const PLAN_BADGE = {
  free: null /* no badge shown for free */,
  pro: { label: "Pro Account", cls: "text-primary" },
  premium: { label: "Premium Account", cls: "text-chart-2" },
  growth: { label: "Growth Plan", cls: "text-chart-2" },
  enterprise: { label: "Enterprise", cls: "text-chart-2" },
};

/* ── Avatar fallback — initials inside surface-raised circle ─────── */
function Avatar({ name, size = "md" }) {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const sizeMap = {
    sm: "size-8 text-[11px]",
    md: "size-10 text-[13px]",
  };

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full",
        "border border-border bg-popover",
        "font-heading font-semibold leading-none text-primary",
        sizeMap[size],
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

/* ── Section label ───────────────────────────────────────────────── */
function SectionLabel({ label }) {
  return (
    <li className="px-4 pb-1 pt-5 first:pt-2" aria-hidden="true">
      <span className="font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/60">
        {label}
      </span>
    </li>
  );
}

/* ── Nav link item ───────────────────────────────────────────────── */
function NavItem({ item, pathname }) {
  const { label, href, icon: Icon } = item;

  /* exact match for overview pages; prefix match for sub-routes */
  const isExact = href === pathname;
  const isPrefix =
    !isExact &&
    pathname.startsWith(href) &&
    href !== "/dashboard/seeker" &&
    href !== "/dashboard/recruiter" &&
    href !== "/dashboard/admin";
  const isActive = isExact || isPrefix;

  return (
    <li>
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group relative flex h-9 items-center gap-3 rounded-lg px-3",
          "font-sans text-[14px] transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive
            ? [
                "bg-popover text-primary font-medium",
                /* Left border accent — inset via box-shadow so it doesn't affect layout */
                "shadow-[inset_2px_0_0_0_var(--primary)]",
              ]
            : [
                "text-muted-foreground",
                "hover:bg-popover hover:text-foreground",
              ],
        )}
      >
        <Icon
          className={cn(
            "size-4.5 shrink-0 transition-colors duration-150",
            isActive
              ? "text-primary"
              : "text-muted-foreground group-hover:text-foreground",
          )}
          aria-hidden="true"
          strokeWidth={isActive ? 2 : 1.75}
        />
        <span className="truncate">{label}</span>
      </Link>
    </li>
  );
}

/* ── Collapsible nav group (parent + children) ───────────────────── */
function NavGroup({ item, pathname }) {
  const { label, href, icon: Icon, children } = item;

  /* Parent is active on exact match; children checked separately */
  const parentActive = pathname === href;
  const childActive = children.some(
    (c) => pathname === c.href || pathname.startsWith(c.href),
  );

  /* Auto-open when the current route is inside this group */
  const [open, setOpen] = useState(parentActive || childActive);

  const triggerActive = parentActive || childActive;

  return (
    <li>
      {/* ── Group trigger ── */}
      <div className="flex items-center gap-0.5">
        {/* Clicking the label navigates AND opens the drawer */}
        <Link
          href={href}
          aria-current={parentActive ? "page" : undefined}
          onClick={() => setOpen(true)}
          className={cn(
            "group relative flex h-9 flex-1 items-center gap-3 rounded-lg px-3",
            "font-sans text-[14px] transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            triggerActive
              ? [
                  "bg-popover text-primary font-medium",
                  "shadow-[inset_2px_0_0_0_var(--primary)]",
                ]
              : [
                  "text-muted-foreground",
                  "hover:bg-popover hover:text-foreground",
                ],
          )}
        >
          <Icon
            className={cn(
              "size-4.5 shrink-0 transition-colors duration-150",
              triggerActive
                ? "text-primary"
                : "text-muted-foreground group-hover:text-foreground",
            )}
            aria-hidden="true"
            strokeWidth={triggerActive ? 2 : 1.75}
          />
          <span className="truncate">{label}</span>
        </Link>

        {/* Chevron — toggles open/closed independently */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? `Collapse ${label}` : `Expand ${label}`}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            triggerActive
              ? "text-primary hover:bg-popover"
              : "text-muted-foreground hover:bg-popover hover:text-foreground",
          )}
        >
          <ChevronRight
            className={cn(
              "size-3.5 transition-transform duration-200",
              open && "rotate-90",
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* ── Children ── */}
      {open && (
        <ul className="mt-0.5 flex flex-col gap-0.5 pl-4" role="list">
          {/* Left connector line */}
          <div className="relative">
            <span
              className="pointer-events-none absolute left-1.5 top-0 bottom-0 w-px bg-border"
              aria-hidden="true"
            />
            {children.map((child) => {
              const childIsActive =
                pathname === child.href || pathname.startsWith(child.href);
              const ChildIcon = child.icon;
              return (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    aria-current={childIsActive ? "page" : undefined}
                    className={cn(
                      "group relative flex h-8 items-center gap-3 rounded-lg pl-5 pr-3",
                      "font-sans text-[13px] transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      childIsActive
                        ? "bg-popover text-primary font-medium"
                        : "text-muted-foreground hover:bg-popover hover:text-foreground",
                    )}
                  >
                    <ChildIcon
                      className={cn(
                        "size-3.5 shrink-0 transition-colors duration-150",
                        childIsActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground",
                      )}
                      aria-hidden="true"
                      strokeWidth={childIsActive ? 2 : 1.75}
                    />
                    <span className="truncate">{child.label}</span>
                  </Link>
                </li>
              );
            })}
          </div>
        </ul>
      )}
    </li>
  );
}

/* ── Main Sidebar ────────────────────────────────────────────────── */
export default function Sidebar({ user }) {
  const pathname = usePathname();
  const u = user ?? {};
  const navItems = getNavByRole(u.role);
  const roleBadge = ROLE_BADGE[u.role] ?? ROLE_BADGE.seeker;
  const planBadge = PLAN_BADGE[u.plan] ?? null;

  return (
    <aside
      className={cn(
        /* Fixed, full-height left column */
        "fixed inset-y-0 left-0 z-30",
        "flex w-60 flex-col",
        "bg-card border-r border-border",
      )}
      aria-label="Dashboard navigation"
    >
      {/* ════════════════════════════════════════════════════════════
          TOP — logo
          ════════════════════════════════════════════════════════════ */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 select-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
          )}
          aria-label="Hireloop home"
        >
          {/* BrandMark inline at sidebar scale */}
          <svg
            width="22"
            height="22"
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
            <clipPath id="sidebar-brand-bottom">
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
              clipPath="url(#sidebar-brand-bottom)"
            />
          </svg>
          <span className="font-heading text-[18px] font-bold leading-none tracking-tight text-foreground">
            Hireloop
          </span>
        </Link>
      </div>

      {/* ════════════════════════════════════════════════════════════
          USER INFO BLOCK
          ════════════════════════════════════════════════════════════ */}
      <div className="shrink-0 border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={u.name} size="md" />
          <div className="min-w-0 flex-1 flex flex-col gap-0.5">
            <span className="truncate font-sans text-[14px] font-medium leading-snug text-foreground">
              {u.name}
            </span>
            <span className="truncate font-sans text-[12px] leading-snug text-muted-foreground">
              {u.email}
            </span>
          </div>
        </div>

        {/* Role badge */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5",
              "font-sans text-[11px] font-medium",
              roleBadge.cls,
              "bg-primary/10",
            )}
          >
            {roleBadge.label}
          </span>

          {/* Plan badge — amber small-caps */}
          {planBadge && (
            <span
              className={cn(
                "font-sans text-[10px] font-medium uppercase tracking-[0.12em]",
                planBadge.cls,
              )}
            >
              {planBadge.label}
            </span>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          NAV LINKS  (scrollable middle)
          ════════════════════════════════════════════════════════════ */}
      <nav
        className="flex-1 overflow-y-auto px-2 py-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
        aria-label="Sidebar navigation"
      >
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item, i) =>
            item.type === "section" ? (
              <SectionLabel key={`section-${i}`} label={item.label} />
            ) : item.type === "group" ? (
              <NavGroup key={item.href} item={item} pathname={pathname} />
            ) : (
              <NavItem key={item.href} item={item} pathname={pathname} />
            ),
          )}
        </ul>
      </nav>

      {/* ════════════════════════════════════════════════════════════
          BOTTOM — user + log out
          ════════════════════════════════════════════════════════════ */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar name={u.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-[13px] font-medium leading-snug text-foreground">
              {u.name}
            </p>
          </div>
          <button
            type="button"
            aria-label="Log out"
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md",
              "text-muted-foreground transition-colors duration-150",
              "hover:bg-destructive/10 hover:text-destructive",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}
