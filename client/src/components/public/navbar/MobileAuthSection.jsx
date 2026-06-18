"use client";

import Link from "next/link";
import Avatar from "./Avatar";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import dashboardHref from "./dashboardHref";
import { cn } from "@/lib/utils";

const MobileAuthSection = ({ session, onClose }) => {
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
};

export default MobileAuthSection;
