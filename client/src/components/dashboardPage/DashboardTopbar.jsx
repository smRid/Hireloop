"use client";

import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Avatar — same initials pattern as Sidebar ───────────────────── */
function TopbarAvatar({ name }) {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full",
        "border border-border bg-popover",
        "font-heading text-[11px] font-semibold leading-none text-primary",
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

/* ── Notification bell with teal dot ─────────────────────────────── */
function NotificationBell({ count = 0 }) {
  const hasNew = count > 0;
  return (
    <button
      type="button"
      aria-label={hasNew ? `${count} new notifications` : "Notifications"}
      className={cn(
        "relative flex size-9 shrink-0 items-center justify-center rounded-lg",
        "border border-border bg-transparent text-muted-foreground",
        "transition-colors duration-150",
        "hover:border-border hover:bg-popover hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <Bell className="size-4.5" aria-hidden="true" />
      {/* Teal notification dot */}
      {hasNew && (
        <span
          className="absolute right-2 top-2 flex size-2 items-center justify-center rounded-full bg-primary"
          aria-hidden="true"
        >
          {/* Inner pulse ring */}
          <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60 animate-ping" />
        </span>
      )}
    </button>
  );
}

/* ── Topbar ──────────────────────────────────────────────────────── */
export default function DashboardTopbar({
  title,
  user,
  notificationCount = 3,
}) {
  const [searchValue, setSearchValue] = useState("");

  const u = user ?? { name: "Alex Johnson", email: "alex@example.com" };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-20",
        "flex h-16 items-center justify-between gap-4",
        /* Offset by sidebar width */
        "left-60",
        "border-b border-border/80 bg-card/90 shadow-[0_1px_0_color-mix(in_oklch,var(--foreground)_4%,transparent)] backdrop-blur-xl",
        "px-6",
      )}
      aria-label="Dashboard topbar"
    >
      {/* ── Left: page title ── */}
      <h1 className="shrink-0 font-heading text-[20px] font-semibold leading-none text-foreground">
        {title}
      </h1>

      {/* ── Right: search + bell + avatar ── */}
      <div className="flex items-center gap-3">
        {/* Search input */}
        <div
          className={cn(
            "relative hidden sm:flex items-center",
            "h-9 w-70",
            "rounded-lg border border-border/90 bg-popover/80",
            "transition-all duration-200",
            "focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/25",
          )}
        >
          <Search
            className="ml-3 size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search…"
            aria-label="Dashboard search"
            className={cn(
              "flex-1 bg-transparent px-2.5",
              "font-sans text-[14px] text-foreground placeholder:text-muted-foreground",
              "outline-none border-none h-full",
            )}
          />
        </div>

        {/* Notification bell */}
        <NotificationBell count={notificationCount} />

        {/* User avatar */}
        <button
          type="button"
          aria-label="Open user menu"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
        >
          <TopbarAvatar name={u.name} />
        </button>
      </div>
    </header>
  );
}
