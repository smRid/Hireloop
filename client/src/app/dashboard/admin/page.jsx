"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  CartesianGrid,
} from "recharts";
import {
  Users,
  UserCheck,
  Building2,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════════
   DESIGN TOKENS (matched to globals.css dark values)
   ════════════════════════════════════════════════════════════════════ */

const C = {
  primary: "#00D4AA",
  primaryFaint: "rgba(0,212,170,0.12)",
  primaryFaint2: "rgba(0,212,170,0.04)",
  border: "oklch(0.24 0.028 255)",
  mutedFg: "#94A3B8",
  card: "oklch(0.17 0.02 255)",
  popover: "oklch(0.19 0.022 255)",
  chart2: "#F59E0B",
  chart3: "#22C55E",
  chart4: "#EF4444",
};

/* ════════════════════════════════════════════════════════════════════
   MOCK DATA
   ════════════════════════════════════════════════════════════════════ */

const STATS = [
  {
    id: "users",
    label: "Total Users",
    value: "12,840",
    icon: Users,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    gradient: false,
  },
  {
    id: "recruiters",
    label: "Total Recruiters",
    value: "1,204",
    icon: UserCheck,
    iconColor: "text-chart-2",
    iconBg: "bg-chart-2/10",
    gradient: false,
  },
  {
    id: "companies",
    label: "Total Companies",
    value: "387",
    icon: Building2,
    iconColor: "text-chart-3",
    iconBg: "bg-chart-3/10",
    gradient: false,
  },
  {
    id: "jobs",
    label: "Jobs Posted",
    value: "5,631",
    icon: Briefcase,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    gradient: false,
  },
  {
    id: "revenue",
    label: "Platform Revenue",
    value: "$84,290",
    icon: DollarSign,
    iconColor: "text-primary-foreground",
    iconBg: "bg-primary-foreground/20",
    gradient: true,
  },
];

/* ── Bar chart: job posts by category ── */
const JOBS_BY_CATEGORY = [
  { category: "Engineering", posts: 1840 },
  { category: "Design", posts: 620 },
  { category: "Marketing", posts: 480 },
  { category: "Product", posts: 390 },
  { category: "Data", posts: 710 },
  { category: "DevOps", posts: 330 },
  { category: "Sales", posts: 260 },
  { category: "Cust. Success", posts: 200 },
];

/* ── Line chart: new registrations over 30 days ── */
function genRegistrations() {
  const base = new Date("2026-05-08");
  const labels = [
    "May 8",
    "May 10",
    "May 12",
    "May 14",
    "May 16",
    "May 18",
    "May 20",
    "May 22",
    "May 24",
    "May 26",
    "May 28",
    "May 30",
    "Jun 1",
    "Jun 3",
    "Jun 5",
    "Jun 7",
  ];
  const values = [
    42, 58, 51, 73, 68, 90, 84, 112, 97, 128, 105, 144, 133, 159, 142, 168,
  ];
  return labels.map((date, i) => ({ date, users: values[i] }));
}
const REGISTRATIONS = genRegistrations();

/* ── Recent payments ── */
const PAYMENTS = [
  {
    id: 1,
    name: "Sarah Chen",
    initials: "SC",
    plan: "Pro",
    amount: "$29",
    date: "Jun 7, 2026",
  },
  {
    id: 2,
    name: "Marcus Webb",
    initials: "MW",
    plan: "Growth",
    amount: "$79",
    date: "Jun 7, 2026",
  },
  {
    id: 3,
    name: "Priya Nair",
    initials: "PN",
    plan: "Pro",
    amount: "$29",
    date: "Jun 6, 2026",
  },
  {
    id: 4,
    name: "Lena Müller",
    initials: "LM",
    plan: "Enterprise",
    amount: "$299",
    date: "Jun 6, 2026",
  },
  {
    id: 5,
    name: "James Okafor",
    initials: "JO",
    plan: "Pro",
    amount: "$29",
    date: "Jun 5, 2026",
  },
  {
    id: 6,
    name: "David Park",
    initials: "DP",
    plan: "Growth",
    amount: "$79",
    date: "Jun 5, 2026",
  },
  {
    id: 7,
    name: "Amara Diallo",
    initials: "AD",
    plan: "Premium",
    amount: "$49",
    date: "Jun 4, 2026",
  },
];

/* ════════════════════════════════════════════════════════════════════
   SHARED CHART TOOLTIP
   ════════════════════════════════════════════════════════════════════ */

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-popover px-3.5 py-2.5",
        "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]",
      )}
    >
      <p className="mb-1 font-sans text-[12px] text-muted-foreground">
        {label}
      </p>
      {payload.map((p, i) => (
        <p
          key={i}
          className="font-heading text-[14px] font-semibold"
          style={{ color: p.color ?? C.primary }}
        >
          {formatter ? formatter(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   STAT CARD
   ════════════════════════════════════════════════════════════════════ */

function StatCard({ stat }) {
  const { label, value, icon: Icon, iconColor, iconBg, gradient } = stat;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 overflow-hidden rounded-xl border p-6",
        "transition-all duration-200",
        gradient
          ? [
              "border-primary/30",
              "bg-[linear-gradient(135deg,oklch(0.20_0.04_178)_0%,oklch(0.17_0.02_255)_100%)]",
              "hover:border-primary/50",
              "hover:shadow-[0_4px_24px_-4px_color-mix(in_oklch,var(--primary)_20%,transparent)]",
            ]
          : [
              "border-border bg-card",
              "hover:border-primary/40",
              "hover:shadow-[0_4px_20px_-4px_color-mix(in_oklch,var(--primary)_10%,transparent)]",
            ],
      )}
    >
      {/* Subtle teal glow in top-right for revenue card */}
      {gradient && (
        <div
          className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,212,170,0.18) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
      )}

      <span
        className={cn(
          "relative flex size-10 items-center justify-center rounded-lg",
          iconBg,
        )}
        aria-hidden="true"
      >
        <Icon className={cn("size-5", iconColor)} strokeWidth={1.75} />
      </span>

      <div className="relative flex flex-col gap-1">
        <span
          className={cn(
            "font-heading text-[36px] font-bold leading-none",
            gradient ? "text-primary" : "text-primary",
          )}
        >
          {value}
        </span>
        <span
          className={cn(
            "font-sans text-[14px]",
            gradient ? "text-primary/70" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PANEL WRAPPER
   ════════════════════════════════════════════════════════════════════ */

function Panel({ id, heading, children, className }) {
  return (
    <section
      aria-labelledby={id}
      className={cn(
        "flex flex-col gap-5 rounded-xl border border-border bg-card p-6",
        className,
      )}
    >
      <h2
        id={id}
        className="font-heading text-[18px] font-semibold text-foreground"
      >
        {heading}
      </h2>
      {children}
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   CUSTOM BAR SHAPE — rounded top corners only
   ════════════════════════════════════════════════════════════════════ */

function RoundedBar(props) {
  const { x, y, width, height } = props;
  if (!height || height <= 0) return null;
  const r = Math.min(4, width / 2);
  return (
    <path
      d={`
        M ${x},${y + height}
        L ${x},${y + r}
        Q ${x},${y} ${x + r},${y}
        L ${x + width - r},${y}
        Q ${x + width},${y} ${x + width},${y + r}
        L ${x + width},${y + height}
        Z
      `}
      fill={C.primary}
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   BAR CHART — Jobs by Category
   ════════════════════════════════════════════════════════════════════ */

function JobsByCategoryChart() {
  return (
    <Panel
      id="bar-chart-heading"
      heading="Job Posts by Category"
      className="flex-1 min-w-0"
    >
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={JOBS_BY_CATEGORY}
            margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
            barCategoryGap="32%"
          >
            <CartesianGrid
              vertical={false}
              stroke={C.border}
              strokeDasharray="3 3"
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey="category"
              tick={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fill: C.mutedFg,
              }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                fill: C.mutedFg,
              }}
              axisLine={false}
              tickLine={false}
              dx={-4}
            />
            <Tooltip
              content={
                <ChartTooltip
                  formatter={(v) => `${v.toLocaleString()} posts`}
                />
              }
              cursor={{ fill: C.primaryFaint, radius: 4 }}
            />
            <Bar dataKey="posts" shape={<RoundedBar />} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

/* ════════════════════════════════════════════════════════════════════
   LINE/AREA CHART — New Registrations
   ════════════════════════════════════════════════════════════════════ */

function RegistrationsChart() {
  return (
    <Panel
      id="line-chart-heading"
      heading="New User Registrations (30 days)"
      className="flex-1 min-w-0"
    >
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={REGISTRATIONS}
            margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="tealAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.primary} stopOpacity={0.18} />
                <stop offset="100%" stopColor={C.primary} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke={C.border}
              strokeDasharray="3 3"
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey="date"
              tick={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fill: C.mutedFg,
              }}
              axisLine={false}
              tickLine={false}
              dy={8}
              interval={2}
            />
            <YAxis
              tick={{
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                fill: C.mutedFg,
              }}
              axisLine={false}
              tickLine={false}
              dx={-4}
            />
            <Tooltip
              content={<ChartTooltip formatter={(v) => `${v} new users`} />}
              cursor={{
                stroke: C.primary,
                strokeWidth: 1,
                strokeDasharray: "4 4",
                strokeOpacity: 0.5,
              }}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke={C.primary}
              strokeWidth={2}
              fill="url(#tealAreaGrad)"
              dot={false}
              activeDot={{
                r: 4,
                fill: C.primary,
                stroke: "oklch(0.17 0.02 255)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PLAN BADGE
   ════════════════════════════════════════════════════════════════════ */

const PLAN_CLS = {
  Pro: "bg-primary/10 text-primary",
  Growth: "bg-chart-2/10 text-chart-2",
  Premium: "bg-primary/10 text-primary",
  Enterprise: "bg-chart-2/10 text-chart-2",
  Free: "bg-secondary text-secondary-foreground",
};

function PlanBadge({ plan }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5",
        "font-sans text-[11px] font-medium",
        PLAN_CLS[plan] ?? PLAN_CLS.Free,
      )}
    >
      {plan}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════
   RECENT PAYMENTS
   ════════════════════════════════════════════════════════════════════ */

function PaymentRow({ payment }) {
  return (
    <li
      className={cn(
        "flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3",
        "transition-colors duration-100 hover:bg-popover",
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          "border border-border bg-popover",
          "font-heading text-[12px] font-semibold leading-none text-primary",
        )}
        aria-hidden="true"
      >
        {payment.initials}
      </div>

      {/* Name + plan */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-sans text-[14px] font-medium leading-snug text-foreground truncate">
          {payment.name}
        </span>
        <PlanBadge plan={payment.plan} />
      </div>

      {/* Amount + date */}
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span className="font-heading text-[16px] font-semibold text-primary">
          {payment.amount}
        </span>
        <span className="font-sans text-[12px] text-muted-foreground whitespace-nowrap">
          {payment.date}
        </span>
      </div>
    </li>
  );
}

function RecentPayments() {
  return (
    <section aria-labelledby="payments-heading">
      <div className="flex flex-col gap-4">
        <h2
          id="payments-heading"
          className="font-heading text-[18px] font-semibold text-foreground"
        >
          Recent Payments
        </h2>
        <ul className="flex flex-col gap-2.5" aria-label="Recent payment list">
          {PAYMENTS.map((p) => (
            <PaymentRow key={p.id} payment={p} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* ── Stats row (5 cards) ── */}
      <div
        className="grid grid-cols-2 gap-5 lg:grid-cols-5"
        role="list"
        aria-label="Platform stats"
      >
        {STATS.map((stat) => (
          <div key={stat.id} role="listitem">
            <StatCard stat={stat} />
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <JobsByCategoryChart />
        <RegistrationsChart />
      </div>

      {/* ── Recent Payments ── */}
      <RecentPayments />
    </div>
  );
}
