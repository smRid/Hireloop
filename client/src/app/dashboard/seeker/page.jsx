"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Bookmark,
  FileText,
  CalendarCheck,
  BadgeCheck,
  Pencil,
  CheckCircle2,
  Clock,
  Star,
  XCircle,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════════
   MOCK DATA
   ════════════════════════════════════════════════════════════════════ */

const MOCK_USER = {
  name: "Jordan Rivera",
  email: "jordan.rivera@example.com",
  plan: "free" /* "free" | "pro" | "premium" */,
  skills: ["React", "TypeScript", "Node.js", "Figma"],
};

const STATS = [
  {
    id: "saved",
    label: "Saved Jobs",
    value: "14",
    icon: Bookmark,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    id: "submitted",
    label: "Applications Submitted",
    value: "27",
    icon: FileText,
    iconColor: "text-chart-2",
    iconBg: "bg-chart-2/10",
  },
  {
    id: "interviews",
    label: "Interviews Scheduled",
    value: "5",
    icon: CalendarCheck,
    iconColor: "text-chart-3",
    iconBg: "bg-chart-3/10",
  },
  {
    id: "offers",
    label: "Offers Received",
    value: "2",
    icon: BadgeCheck,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
];

/* ── Donut chart data — status breakdown ── */
const CHART_DATA = [
  { label: "Applied", count: 12, color: "#94A3B8" },
  { label: "Under Review", count: 7, color: "#F59E0B" },
  { label: "Shortlisted", count: 5, color: "#00D4AA" },
  { label: "Rejected", count: 2, color: "#EF4444" },
  { label: "Offered", count: 1, color: "#22C55E" },
];

/* ── Activity feed ── */
const NOW = new Date("2026-06-07T12:00:00Z");

function hoursAgoISO(h) {
  return new Date(NOW - h * 3600000).toISOString();
}

const ACTIVITY_STATUS_MAP = {
  Applied: { color: "#94A3B8", icon: Send, label: "Applied" },
  "Under Review": { color: "#F59E0B", icon: Clock, label: "Under Review" },
  Shortlisted: { color: "#00D4AA", icon: Star, label: "Shortlisted" },
  Rejected: { color: "#EF4444", icon: XCircle, label: "Rejected" },
  Offered: { color: "#22C55E", icon: CheckCircle2, label: "Offered" },
};

const ACTIVITY = [
  {
    id: 1,
    job: "Senior Product Designer",
    company: "Figma",
    status: "Offered",
    at: hoursAgoISO(1),
  },
  {
    id: 2,
    job: "AI Platform Engineer",
    company: "Vercel",
    status: "Shortlisted",
    at: hoursAgoISO(5),
  },
  {
    id: 3,
    job: "Growth Marketing Manager",
    company: "Notion",
    status: "Under Review",
    at: hoursAgoISO(22),
  },
  {
    id: 4,
    job: "Backend Engineer – Payments",
    company: "Stripe",
    status: "Applied",
    at: hoursAgoISO(48),
  },
  {
    id: 5,
    job: "Customer Success Lead",
    company: "Intercom",
    status: "Rejected",
    at: hoursAgoISO(72),
  },
];

/* ════════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════════ */

function relativeTime(isoString) {
  const diffMs = NOW - new Date(isoString);
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ════════════════════════════════════════════════════════════════════
   STAT CARD  (matches Recruiter dashboard style exactly)
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
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-lg",
          iconBg,
        )}
        aria-hidden="true"
      >
        <Icon className={cn("size-5", iconColor)} strokeWidth={1.75} />
      </span>
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
   PROFILE CARD (left column)
   ════════════════════════════════════════════════════════════════════ */

const PLAN_CONFIG = {
  free: {
    label: "Free Plan",
    cls: "text-chart-2 font-sans text-[10px] font-medium uppercase tracking-[0.12em]",
  },
  pro: {
    label: "Pro",
    cls: "text-primary font-sans text-[10px] font-medium uppercase tracking-[0.12em]",
  },
  premium: {
    label: "Premium",
    cls: "text-chart-2 font-sans text-[10px] font-medium uppercase tracking-[0.12em]",
  },
};

function ProfileCard({ user }) {
  const plan = PLAN_CONFIG[user.plan] ?? PLAN_CONFIG.free;

  return (
    <section
      aria-label="Your profile"
      className={cn(
        "flex flex-col gap-6 rounded-xl border border-border bg-card p-6",
      )}
    >
      {/* ── Avatar + name + email ── */}
      <div className="flex flex-col items-center gap-3 text-center">
        {/* 72px initials avatar */}
        <div
          className={cn(
            "flex size-18 shrink-0 items-center justify-center rounded-full",
            "border-2 border-border bg-popover",
            "font-heading text-[22px] font-bold leading-none text-primary",
          )}
          aria-hidden="true"
        >
          {initials(user.name)}
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-[20px] font-semibold leading-tight text-foreground">
            {user.name}
          </h2>
          <p className="font-sans text-[14px] text-muted-foreground">
            {user.email}
          </p>
        </div>

        {/* Badges row */}
        <div className="flex items-center gap-2">
          {/* Role badge */}
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5",
              "font-sans text-[11px] font-medium",
              "bg-primary/10 text-primary",
            )}
          >
            Seeker
          </span>

          {/* Plan badge */}
          <span className={plan.cls}>{plan.label}</span>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="h-px w-full bg-border" aria-hidden="true" />

      {/* ── Skills ── */}
      <div className="flex flex-col gap-2.5">
        <p className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-muted-foreground/60">
          Skills
        </p>
        <div className="flex flex-wrap gap-2" aria-label="Your skills">
          {user.skills.map((skill) => (
            <span
              key={skill}
              className={cn(
                "inline-flex items-center rounded-full border border-border bg-popover px-3 py-1",
                "font-sans text-[12px] text-muted-foreground",
              )}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* ── Edit Profile button ── */}
      <button
        type="button"
        className={cn(
          "flex h-9 w-full items-center justify-center gap-2 rounded-lg",
          "border border-border bg-transparent",
          "font-sans text-[14px] font-medium text-muted-foreground",
          "transition-all duration-150",
          "hover:border-primary/50 hover:text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
        aria-label="Edit your profile"
      >
        <Pencil className="size-3.5" aria-hidden="true" />
        Edit Profile
      </button>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   DONUT CHART  (right column)
   ════════════════════════════════════════════════════════════════════ */

/* Custom tooltip that matches the design system */
function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { label, count, color } = payload[0].payload;
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-popover px-3 py-2",
        "shadow-[0_4px_16px_-4px_rgba(0,0,0,0.4)]",
      )}
    >
      <p className="font-sans text-[13px] font-medium" style={{ color }}>
        {label}
      </p>
      <p className="font-sans text-[12px] text-muted-foreground">
        {count} application{count !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

function ApplicationOverview({ data }) {
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <section
      aria-labelledby="overview-heading"
      className={cn(
        "flex flex-col gap-5 rounded-xl border border-border bg-card p-6",
      )}
    >
      <h2
        id="overview-heading"
        className="font-heading text-[18px] font-semibold text-foreground"
      >
        Application Overview
      </h2>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        {/* ── Donut chart ── */}
        <div
          className="relative shrink-0"
          style={{ width: 180, height: 180 }}
          role="img"
          aria-label={`Donut chart: ${total} total applications`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={84}
                paddingAngle={2}
                dataKey="count"
                strokeWidth={0}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={600}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
            aria-hidden="true"
          >
            <span className="font-heading text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Total
            </span>
            <span className="font-heading text-[28px] font-bold leading-none text-foreground">
              {total}
            </span>
          </div>
        </div>

        {/* ── Legend ── */}
        <ul
          className="flex flex-1 flex-col gap-3 min-w-0"
          aria-label="Application status legend"
        >
          {data.map((entry) => (
            <li
              key={entry.label}
              className="flex items-center justify-between gap-3"
            >
              {/* Dot + label */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color }}
                  aria-hidden="true"
                />
                <span className="font-sans text-[14px] text-muted-foreground truncate">
                  {entry.label}
                </span>
              </div>
              {/* Count */}
              <span
                className="font-heading text-[15px] font-semibold shrink-0"
                style={{ color: entry.color }}
                aria-label={`${entry.count} ${entry.label}`}
              >
                {entry.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   RECENT ACTIVITY
   ════════════════════════════════════════════════════════════════════ */

function ActivityItem({ item }) {
  const cfg = ACTIVITY_STATUS_MAP[item.status] ?? ACTIVITY_STATUS_MAP.Applied;
  const Icon = cfg.icon;

  return (
    <li
      className={cn(
        "flex items-start gap-4 rounded-lg border border-border bg-card px-4 py-3.5",
        "transition-colors duration-100 hover:bg-popover",
        /* Left accent border via box-shadow so layout is unaffected */
        "shadow-[inset_3px_0_0_0_var(--status-color)]",
      )}
      style={{ "--status-color": cfg.color }}
    >
      {/* Status icon */}
      <span
        className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${cfg.color}18` }}
        aria-hidden="true"
      >
        <Icon
          className="size-3.5"
          style={{ color: cfg.color }}
          strokeWidth={2}
        />
      </span>

      {/* Text */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="font-sans text-[14px] leading-snug text-foreground">
          Your application for <span className="font-medium">{item.job}</span>{" "}
          at <span className="font-medium">{item.company}</span> is{" "}
          <span className="font-medium" style={{ color: cfg.color }}>
            {cfg.label}
          </span>
        </p>
      </div>

      {/* Time */}
      <span className="shrink-0 font-sans text-[12px] text-muted-foreground whitespace-nowrap">
        {relativeTime(item.at)}
      </span>
    </li>
  );
}

function RecentActivity({ items }) {
  return (
    <section aria-labelledby="activity-heading">
      <div className="flex flex-col gap-4">
        <h2
          id="activity-heading"
          className="font-heading text-[18px] font-semibold text-foreground"
        >
          Recent Activity
        </h2>

        {items.length === 0 ? (
          <p className="font-sans text-[14px] text-muted-foreground">
            No activity yet. Start applying to jobs to see updates here.
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5" aria-label="Recent activity">
            {items.map((item) => (
              <ActivityItem key={item.id} item={item} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */

export default function SeekerDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* ── Stats row ── */}
      <div
        className="grid grid-cols-2 gap-5 lg:grid-cols-4"
        role="list"
        aria-label="Your stats"
      >
        {STATS.map((stat) => (
          <div key={stat.id} role="listitem">
            <StatCard stat={stat} />
          </div>
        ))}
      </div>

      {/* ── Two-column row: Profile + Overview ── */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        {/* Left — Profile Card (40%) */}
        <div className="w-full xl:w-[38%] xl:shrink-0">
          <ProfileCard user={MOCK_USER} />
        </div>

        {/* Right — Application Overview (60%) */}
        <div className="min-w-0 flex-1">
          <ApplicationOverview data={CHART_DATA} />
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <RecentActivity items={ACTIVITY} />
    </div>
  );
}
