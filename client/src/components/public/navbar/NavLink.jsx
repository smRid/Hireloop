"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

const NavLink = ({ href, children, onClick, isActive }) => {
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
};

export default NavLink;
