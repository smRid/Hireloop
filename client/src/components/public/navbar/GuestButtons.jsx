"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

const GuestButtons = ({ onClose }) => {
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
};

export default GuestButtons;
