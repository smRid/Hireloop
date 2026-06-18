"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Avatar from "./Avatar";
import Link from "next/link";
import { LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import dashboardHref from "./dashboardHref";
import { signOut } from "@/lib/auth-client";

const UserMenu = ({ session }) => {
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
};

export default UserMenu;
