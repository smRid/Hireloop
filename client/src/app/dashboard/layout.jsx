"use client";

import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/layout/Sidebar";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import { getNavByRole } from "@/constants/nav-links";

/* ── Page title context ──────────────────────────────────────────── */
/* Child pages can call usePageTitle() to override the topbar title  */
const PageTitleContext = createContext({ title: "", setTitle: () => {} });
export function usePageTitle() {
  return useContext(PageTitleContext);
}

/* ── Derive a sensible title from the current pathname ───────────── */
function titleFromPathname(pathname, navItems) {
  /* Find the deepest matching nav link */
  const sorted = [...navItems]
    .filter((item) => item.type === "link")
    .sort((a, b) => b.href.length - a.href.length);

  const match = sorted.find((item) => {
    if (item.href === pathname) return true;
    if (item.href !== "/" && pathname.startsWith(item.href)) return true;
    return false;
  });

  return match?.label ?? "Dashboard";
}

/* ── Mock user — replace with real auth session ──────────────────── */
const MOCK_USER = {
  name: "Alex Johnson",
  email: "alex@example.com",
  role: "recruiter" /* "seeker" | "recruiter" | "admin" */,
  plan: "growth" /* "free" | "pro" | "premium" | "growth" | "enterprise" */,
};

/* ── Dashboard root layout ───────────────────────────────────────── */
export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const user = MOCK_USER;
  const navItems = getNavByRole(user.role);
  const autoTitle = titleFromPathname(pathname, navItems);
  const [title, setTitle] = useState(autoTitle);

  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      <div className="flex min-h-screen w-full bg-background">
        {/* ── Sidebar (fixed 240px) ── */}
        <Sidebar user={user} />

        {/* ── Main column (offset by sidebar width) ── */}
        <div className="flex min-h-screen flex-1 flex-col pl-60">
          {/* ── Topbar (fixed, same offset) ── */}
          <DashboardTopbar title={title} user={user} notificationCount={3} />

          {/* ── Page content ── */}
          <main
            id="main-content"
            className={cn(
              /* Push content below fixed topbar */
              "mt-16 flex-1",
              "bg-background",
              "p-8",
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </PageTitleContext.Provider>
  );
}
