"use client";

import Link from "next/link";
import {
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  ArrowRight,
  MapPin,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import useCurrentUser from "@/lib/core/use-current-user";

/* ════════════════════════════════════════════════════════════════════
   MOCK DATA
   ════════════════════════════════════════════════════════════════════ */

const STATS = [
  {
    id: "total-posts",
    label: "Total Job Posts",
    value: "24",
    icon: Briefcase,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    id: "applicants",
    label: "Total Applicants",
    value: "312",
    icon: Users,
    iconColor: "text-chart-2",
    iconBg: "bg-chart-2/10",
  },
  {
    id: "active",
    label: "Active Jobs",
    value: "11",
    icon: CheckCircle2,
    iconColor: "text-chart-3",
    iconBg: "bg-chart-3/10",
  },
  {
    id: "closed",
    label: "Jobs Closed",
    value: "13",
    icon: XCircle,
    iconColor: "text-muted-foreground",
    iconBg: "bg-muted",
  },
];

/* status → style map */
const STATUS_STYLES = {
  New: "bg-secondary text-secondary-foreground",
  Reviewing: "bg-chart-2/10 text-chart-2",
  Interviewing: "bg-primary/10 text-primary",
  Rejected: "bg-chart-4/10 text-chart-4",
  Offered: "bg-chart-3/10 text-chart-3",
};

const APPLICATIONS = [
  {
    id: 1,
    name: "Sarah Chen",
    initials: "SC",
    role: "Senior Product Designer",
    date: "Jun 5, 2026",
    status: "Interviewing",
  },
  {
    id: 2,
    name: "Marcus Webb",
    initials: "MW",
    role: "AI Platform Engineer",
    date: "Jun 4, 2026",
    status: "Reviewing",
  },
  {
    id: 3,
    name: "Priya Nair",
    initials: "PN",
    role: "Senior Product Designer",
    date: "Jun 4, 2026",
    status: "New",
  },
  {
    id: 4,
    name: "James Okafor",
    initials: "JO",
    role: "DevOps Engineer",
    date: "Jun 3, 2026",
    status: "Rejected",
  },
  {
    id: 5,
    name: "Lena Müller",
    initials: "LM",
    role: "Growth Marketing Manager",
    date: "Jun 2, 2026",
    status: "Offered",
  },
  {
    id: 6,
    name: "David Park",
    initials: "DP",
    role: "Backend Engineer – Payments",
    date: "Jun 1, 2026",
    status: "Interviewing",
  },
  {
    id: 7,
    name: "Amara Diallo",
    initials: "AD",
    role: "iOS Engineer",
    date: "May 31, 2026",
    status: "Reviewing",
  },
];

const COMPANIES = [
  {
    id: 1,
    name: "Figma",
    initials: "Fi",
    industry: "Design Tools / SaaS",
    location: "San Francisco, CA",
    activeJobs: 8,
  },
  {
    id: 2,
    name: "Vercel",
    initials: "Ve",
    industry: "Cloud Infrastructure",
    location: "Remote · Global",
    activeJobs: 14,
  },
  {
    id: 3,
    name: "Stripe",
    initials: "St",
    industry: "Fintech / Payments",
    location: "Dublin, Ireland",
    activeJobs: 23,
  },
  {
    id: 4,
    name: "Notion",
    initials: "No",
    industry: "Productivity / SaaS",
    location: "Remote · US",
    activeJobs: 11,
  },
  {
    id: 5,
    name: "Shopify",
    initials: "Sh",
    industry: "E-Commerce / Platform",
    location: "Remote · Canada",
    activeJobs: 37,
  },
];

/* ════════════════════════════════════════════════════════════════════
   PRIMITIVES
   ════════════════════════════════════════════════════════════════════ */

/* ── Candidate avatar — initials ── */
function CandidateAvatar({ initials }) {
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

/* ── Company logo placeholder ── */
function CompanyMark({ initials }) {
  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg",
        "border border-border bg-popover",
        "font-heading text-[12px] font-semibold leading-none text-primary",
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

/* ── Status badge ── */
function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] ?? STATUS_STYLES.New;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5",
        "font-sans text-[12px] font-medium",
        cls,
      )}
    >
      {status}
    </span>
  );
}

/* ── Section header row — heading + "View all" link ── */
function SectionHeader({ heading, href, id }) {
  return (
    <div className="flex items-center justify-between">
      <h2
        id={id}
        className="font-heading text-[18px] font-semibold text-foreground"
      >
        {heading}
      </h2>
      <Link
        href={href}
        className={cn(
          "inline-flex items-center gap-1 font-sans text-[13px] font-medium text-primary",
          "transition-colors duration-150 hover:text-primary/75",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
        )}
      >
        View all
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}

/* ── Panel card wrapper ── */
function Panel({ children, className, ariaLabelledby }) {
  return (
    <section
      aria-labelledby={ariaLabelledby}
      className={cn(
        "flex flex-col gap-5 rounded-xl border border-border bg-card p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   STAT CARD
   ════════════════════════════════════════════════════════════════════ */
function StatCard({ stat }) {
  const { label, value, icon: Icon, iconColor, iconBg } = stat;
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-card p-6",
        "transition-all duration-200",
        "hover:border-primary/40",
        "hover:shadow-[0_4px_20px_-4px_color-mix(in_oklch,var(--primary)_10%,transparent)]",
      )}
    >
      {/* Icon */}
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-lg",
          iconBg,
        )}
        aria-hidden="true"
      >
        <Icon className={cn("size-5", iconColor)} strokeWidth={1.75} />
      </span>

      {/* Value */}
      <div className="flex flex-col gap-1">
        <span className="font-heading text-[36px] font-bold leading-none text-primary">
          {value}
        </span>
        <span className="font-sans text-[14px] text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   RECENT APPLICATIONS TABLE
   ════════════════════════════════════════════════════════════════════ */
function RecentApplications() {
  return (
    <Panel ariaLabelledby="recent-apps-heading" className="flex-1 min-w-0">
      <SectionHeader
        id="recent-apps-heading"
        heading="Recent Applications"
        href="/dashboard/recruiter/jobs"
      />

      <Table aria-labelledby="recent-apps-heading">
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="font-sans text-[12px] font-medium uppercase tracking-widest text-muted-foreground/70 pl-0">
              Candidate
            </TableHead>
            <TableHead className="font-sans text-[12px] font-medium uppercase tracking-widest text-muted-foreground/70">
              Role
            </TableHead>
            <TableHead className="font-sans text-[12px] font-medium uppercase tracking-widest text-muted-foreground/70">
              Applied
            </TableHead>
            <TableHead className="font-sans text-[12px] font-medium uppercase tracking-widest text-muted-foreground/70 pr-0">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {APPLICATIONS.map((app) => (
            <TableRow
              key={app.id}
              className={cn(
                "border-border",
                "transition-colors duration-100",
                "hover:bg-popover",
                "cursor-pointer",
              )}
            >
              {/* Candidate name + avatar */}
              <TableCell className="pl-0 py-3">
                <div className="flex items-center gap-2.5">
                  <CandidateAvatar initials={app.initials} />
                  <span className="font-sans text-[14px] font-medium text-foreground whitespace-nowrap">
                    {app.name}
                  </span>
                </div>
              </TableCell>

              {/* Role */}
              <TableCell className="py-3">
                <span className="font-sans text-[13px] text-muted-foreground max-w-40 truncate block">
                  {app.role}
                </span>
              </TableCell>

              {/* Date applied */}
              <TableCell className="py-3">
                <span className="font-sans text-[13px] text-muted-foreground whitespace-nowrap">
                  {app.date}
                </span>
              </TableCell>

              {/* Status badge */}
              <TableCell className="py-3 pr-0">
                <StatusBadge status={app.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Panel>
  );
}

/* ════════════════════════════════════════════════════════════════════
   TOP COMPANIES LIST
   ════════════════════════════════════════════════════════════════════ */
function CompanyRow({ company }) {
  return (
    <li>
      <Link
        href={`/dashboard/recruiter/company`}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5",
          "transition-colors duration-150",
          "hover:bg-popover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        {/* Logo */}
        <CompanyMark initials={company.initials} />

        {/* Info */}
        <div className="min-w-0 flex-1 flex flex-col gap-0.5">
          <span className="font-sans text-[14px] font-medium leading-snug text-foreground truncate">
            {company.name}
          </span>
          <span className="flex items-center gap-1 font-sans text-[12px] leading-snug text-muted-foreground truncate">
            {company.industry}
            <span className="text-border" aria-hidden="true">
              ·
            </span>
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            {company.location}
          </span>
        </div>

        {/* Active job count */}
        <span
          className="shrink-0 font-heading text-[14px] font-semibold text-primary"
          aria-label={`${company.activeJobs} active jobs`}
        >
          {company.activeJobs}
        </span>
      </Link>
    </li>
  );
}

function TopCompanies() {
  return (
    <Panel ariaLabelledby="top-companies-heading" className="w-full">
      <SectionHeader
        id="top-companies-heading"
        heading="My Top Companies"
        href="/dashboard/recruiter/company"
      />

      {/* Company list */}
      <ul className="-mx-3 flex flex-col gap-0.5" aria-label="Top companies">
        {COMPANIES.map((company) => (
          <CompanyRow key={company.id} company={company} />
        ))}
      </ul>

      {/* Divider */}
      <div className="h-px w-full bg-border" aria-hidden="true" />

      {/* Ghost CTA */}
      <Link
        href="/dashboard/recruiter/company"
        className={cn(
          "flex h-9 w-full items-center justify-center gap-2 rounded-lg",
          "border border-border bg-transparent",
          "font-sans text-[14px] font-medium text-muted-foreground",
          "transition-all duration-150",
          "hover:border-primary/50 hover:text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        View All Companies
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </Panel>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */

/* Current date formatted as "Sunday, June 7, 2026" */
function todayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function RecruiterDashboardPage() {
  const { user: recruiter, isLoading } = useCurrentUser();
  if (isLoading) return null; // session is still being fetched
  const recruiterName = recruiter?.name?.split(" ")[0] ?? "User";

  return (
    <div className="flex flex-col gap-8">
      {/* ── Page heading ── */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-bold leading-tight text-primary">
          Welcome back, {recruiterName} 👋
        </h1>
        <p className="font-sans text-[14px] text-muted-foreground">
          {todayLabel()}
        </p>
      </div>

      {/* ── Stats row ── */}
      <div
        className="grid grid-cols-2 gap-5 lg:grid-cols-4"
        role="list"
        aria-label="Recruiter stats"
      >
        {STATS.map((stat) => (
          <div key={stat.id} role="listitem">
            <StatCard stat={stat} />
          </div>
        ))}
      </div>

      {/* ── Two-column content row ── */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        {/* Left — Recent Applications (60%) */}
        <div className="min-w-0 xl:flex-3">
          <RecentApplications />
        </div>

        {/* Right — Top Companies (40%) */}
        <div className="xl:flex-2 xl:min-w-70">
          <TopCompanies />
        </div>
      </div>
    </div>
  );
}
