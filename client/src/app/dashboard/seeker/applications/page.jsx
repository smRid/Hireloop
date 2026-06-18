"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════════
   MOCK DATA
   ════════════════════════════════════════════════════════════════════ */

const NOW = new Date("2026-06-07T12:00:00Z");

function daysAgoISO(n) {
  const d = new Date(NOW);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const INITIAL_APPLICATIONS = [
  {
    id: 1,
    jobId: 1,
    title: "Senior Product Designer",
    company: "Figma",
    companyInitials: "Fi",
    appliedAt: daysAgoISO(1),
    status: "Shortlisted",
  },
  {
    id: 2,
    jobId: 2,
    title: "AI Platform Engineer",
    company: "Vercel",
    companyInitials: "Ve",
    appliedAt: daysAgoISO(2),
    status: "Under Review",
  },
  {
    id: 3,
    jobId: 4,
    title: "Backend Engineer – Payments",
    company: "Stripe",
    companyInitials: "St",
    appliedAt: daysAgoISO(4),
    status: "Applied",
  },
  {
    id: 4,
    jobId: 5,
    title: "Growth Marketing Manager",
    company: "Notion",
    companyInitials: "No",
    appliedAt: daysAgoISO(5),
    status: "Offered",
  },
  {
    id: 5,
    jobId: 8,
    title: "Product Manager, Jira",
    company: "Atlassian",
    companyInitials: "At",
    appliedAt: daysAgoISO(7),
    status: "Rejected",
  },
  {
    id: 6,
    jobId: 7,
    title: "Data Scientist – Commerce",
    company: "Shopify",
    companyInitials: "Sh",
    appliedAt: daysAgoISO(9),
    status: "Under Review",
  },
  {
    id: 7,
    jobId: 9,
    title: "Developer Relations Engineer",
    company: "GitHub",
    companyInitials: "Gh",
    appliedAt: daysAgoISO(11),
    status: "Applied",
  },
  {
    id: 8,
    jobId: 10,
    title: "Senior Sales Engineer",
    company: "HubSpot",
    companyInitials: "Hu",
    appliedAt: daysAgoISO(14),
    status: "Shortlisted",
  },
  {
    id: 9,
    jobId: 12,
    title: "Customer Success Lead",
    company: "Intercom",
    companyInitials: "In",
    appliedAt: daysAgoISO(18),
    status: "Rejected",
  },
  {
    id: 10,
    jobId: 3,
    title: "DevOps Engineer",
    company: "Linear",
    companyInitials: "Li",
    appliedAt: daysAgoISO(21),
    status: "Applied",
  },
];

/* ════════════════════════════════════════════════════════════════════
   STATUS CONFIG
   ════════════════════════════════════════════════════════════════════ */

const STATUS_CONFIG = {
  Applied: { pillCls: "bg-secondary text-secondary-foreground" },
  "Under Review": { pillCls: "bg-chart-2/10 text-chart-2" },
  Shortlisted: { pillCls: "bg-primary/10 text-primary" },
  Rejected: { pillCls: "bg-chart-4/10 text-chart-4" },
  Offered: { pillCls: "bg-chart-3/10 text-chart-3" },
};

const ALL_STATUSES = ["All", ...Object.keys(STATUS_CONFIG)];

/* ════════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════════ */

function relativeDate(isoString) {
  const diffDays = Math.floor(
    (NOW - new Date(isoString)) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/* ════════════════════════════════════════════════════════════════════
   PRIMITIVES
   ════════════════════════════════════════════════════════════════════ */

/* ── Company logo mark (24px) ── */
function CompanyMark({ initials }) {
  return (
    <div
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded",
        "border border-border bg-popover",
        "font-heading text-[9px] font-semibold leading-none text-primary",
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

/* ── Status badge ── */
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.Applied;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5",
        "font-sans text-[12px] font-medium",
        cfg.pillCls,
      )}
    >
      {status}
    </span>
  );
}

/* ── Filter pill ── */
function FilterPill({ label, active, count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5",
        "font-sans text-[13px] font-medium",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-primary text-primary-foreground"
          : "border border-border bg-popover text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {label}
      {count !== undefined && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 font-sans text-[11px] font-semibold leading-none",
            active
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-border text-muted-foreground",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════
   EMPTY STATE
   ════════════════════════════════════════════════════════════════════ */

function EmptyState({ filtered }) {
  return (
    <TableRow className="hover:bg-transparent border-0">
      <TableCell colSpan={5} className="py-20">
        <div className="flex flex-col items-center justify-center gap-5 text-center">
          {/* Briefcase + magnifier illustration */}
          <div
            className={cn(
              "flex size-24 items-center justify-center rounded-2xl",
              "border border-border bg-popover",
            )}
            aria-hidden="true"
          >
            <svg
              width="52"
              height="52"
              viewBox="0 0 52 52"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground/40"
            >
              {/* Briefcase body */}
              <rect x="6" y="18" width="30" height="22" rx="3" />
              {/* Briefcase handle */}
              <path d="M18 18v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
              {/* Centre divider */}
              <line x1="6" y1="28" x2="36" y2="28" />
              {/* Magnifier circle */}
              <circle cx="40" cy="40" r="7" />
              {/* Magnifier handle */}
              <line x1="45.5" y1="45.5" x2="50" y2="50" />
            </svg>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-[18px] font-semibold text-foreground">
              {filtered ? "No matching applications" : "No applications yet"}
            </h3>
            <p className="font-sans text-[14px] text-muted-foreground max-w-xs">
              {filtered
                ? "Try a different status filter to see your applications."
                : "Start applying to jobs and track your progress here."}
            </p>
          </div>

          {!filtered && (
            <Link
              href="/jobs"
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-xl px-6",
                "bg-primary text-primary-foreground",
                "font-sans text-[14px] font-medium",
                "transition-all duration-150 hover:bg-primary/90",
                "hover:shadow-[0_4px_20px_-2px_color-mix(in_oklch,var(--primary)_30%,transparent)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <Briefcase className="size-4" aria-hidden="true" />
              Browse Jobs
            </Link>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */

export default function MyApplicationsPage() {
  const [applications] = useState(INITIAL_APPLICATIONS);
  const [activeFilter, setActiveFilter] = useState("All");

  /* ── Derived data ── */
  const filtered =
    activeFilter === "All"
      ? applications
      : applications.filter((a) => a.status === activeFilter);

  /* Count per status for pill badges */
  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] =
      s === "All"
        ? applications.length
        : applications.filter((a) => a.status === s).length;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-7">
      {/* ══════════════════════════════════════════════════════════
          PAGE HEADER
          ══════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3">
        <h1 className="font-heading text-[28px] font-bold leading-tight text-foreground">
          My Applications
        </h1>
        {/* Total count badge */}
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5",
            "font-sans text-[13px] font-semibold",
            "bg-primary/10 text-primary",
          )}
          aria-label={`${applications.length} total applications`}
        >
          {applications.length}
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════════
          FILTER ROW
          ══════════════════════════════════════════════════════════ */}
      <div
        className="flex gap-2 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden scrollbar-none"
        role="group"
        aria-label="Filter by status"
      >
        {ALL_STATUSES.map((status) => (
          <FilterPill
            key={status}
            label={status}
            active={activeFilter === status}
            count={counts[status]}
            onClick={() => setActiveFilter(status)}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════
          TABLE
          ══════════════════════════════════════════════════════════ */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table aria-label="My job applications">
          {/* ── Header ── */}
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              {[
                { label: "Job Title", cls: "pl-6 w-[260px]" },
                { label: "Company", cls: "w-[180px]" },
                { label: "Date Applied", cls: "w-[140px]" },
                { label: "Status", cls: "w-[140px]" },
                { label: "Action", cls: "pr-6 w-[110px] text-right" },
              ].map(({ label, cls }) => (
                <TableHead
                  key={label}
                  className={cn(
                    "font-sans text-[12px] font-medium uppercase tracking-widest",
                    "text-muted-foreground/60 py-3",
                    cls,
                  )}
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* ── Body ── */}
          <TableBody>
            {filtered.length === 0 ? (
              <EmptyState filtered={activeFilter !== "All"} />
            ) : (
              filtered.map((app) => (
                <TableRow
                  key={app.id}
                  className={cn(
                    "border-border transition-colors duration-100",
                    "hover:bg-popover",
                  )}
                >
                  {/* Job Title */}
                  <TableCell className="pl-6 py-4">
                    <Link
                      href={`/jobs/${app.jobId}`}
                      className={cn(
                        "font-sans text-[14px] font-medium text-primary",
                        "underline-offset-2 hover:underline",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
                      )}
                    >
                      {app.title}
                    </Link>
                  </TableCell>

                  {/* Company */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <CompanyMark initials={app.companyInitials} />
                      <span className="font-sans text-[14px] text-muted-foreground truncate max-w-32.5">
                        {app.company}
                      </span>
                    </div>
                  </TableCell>

                  {/* Date Applied */}
                  <TableCell className="py-4">
                    <span className="font-sans text-[14px] text-muted-foreground whitespace-nowrap">
                      {relativeDate(app.appliedAt)}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-4">
                    <StatusBadge status={app.status} />
                  </TableCell>

                  {/* Action */}
                  <TableCell className="pr-6 py-4">
                    <div className="flex justify-end">
                      <Link
                        href={`/jobs/${app.jobId}`}
                        className={cn(
                          "inline-flex items-center gap-1 font-sans text-[12px] font-medium text-primary",
                          "transition-colors duration-150 hover:text-primary/75",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
                        )}
                        aria-label={`View job listing for ${app.title}`}
                      >
                        View Job
                        <ArrowRight className="size-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
