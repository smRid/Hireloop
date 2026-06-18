"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog";
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

const INITIAL_COMPANIES = [
  {
    id: 1,
    name: "NovaBridge",
    initials: "NB",
    recruiterEmail: "alex.johnson@novabridge.io",
    industry: "Fintech / Payments",
    submittedAt: daysAgoISO(0),
    status: "Pending",
  },
  {
    id: 2,
    name: "Solvora",
    initials: "So",
    recruiterEmail: "founder@solvora.ai",
    industry: "AI / Machine Learning",
    submittedAt: daysAgoISO(1),
    status: "Pending",
  },
  {
    id: 3,
    name: "Archform",
    initials: "Ar",
    recruiterEmail: "team@archform.xyz",
    industry: "Design Tools",
    submittedAt: daysAgoISO(2),
    status: "Rejected",
  },
  {
    id: 4,
    name: "Lumio Labs",
    initials: "LL",
    recruiterEmail: "hi@lumiolabs.co",
    industry: "Developer Tools",
    submittedAt: daysAgoISO(3),
    status: "Approved",
  },
  {
    id: 5,
    name: "Caspian AI",
    initials: "CA",
    recruiterEmail: "careers@caspian.ai",
    industry: "AI / Machine Learning",
    submittedAt: daysAgoISO(4),
    status: "Pending",
  },
  {
    id: 6,
    name: "Driftworks",
    initials: "DW",
    recruiterEmail: "ops@driftworks.io",
    industry: "E-Commerce",
    submittedAt: daysAgoISO(5),
    status: "Approved",
  },
  {
    id: 7,
    name: "Paralink",
    initials: "PL",
    recruiterEmail: "hello@paralink.dev",
    industry: "Communications / CPaaS",
    submittedAt: daysAgoISO(6),
    status: "Pending",
  },
  {
    id: 8,
    name: "Verdant Health",
    initials: "VH",
    recruiterEmail: "jobs@verdanthealth.com",
    industry: "Healthcare",
    submittedAt: daysAgoISO(8),
    status: "Approved",
  },
  {
    id: 9,
    name: "Stackrise",
    initials: "SR",
    recruiterEmail: "admin@stackrise.io",
    industry: "HR & IT Management",
    submittedAt: daysAgoISO(10),
    status: "Rejected",
  },
  {
    id: 10,
    name: "Phaero",
    initials: "Ph",
    recruiterEmail: "team@phaero.com",
    industry: "Security",
    submittedAt: daysAgoISO(12),
    status: "Approved",
  },
];

/* ════════════════════════════════════════════════════════════════════
   STATUS CONFIG
   ════════════════════════════════════════════════════════════════════ */

const STATUS_CONFIG = {
  Pending: {
    pillCls: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  },
  Approved: {
    pillCls: "bg-primary/10 text-primary border-primary/20",
  },
  Rejected: {
    pillCls: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  },
};

const FILTER_TABS = ["All", "Pending", "Approved", "Rejected"];

/* ════════════════════════════════════════════════════════════════════
   CONFIRM DIALOG VARIANTS
   ════════════════════════════════════════════════════════════════════ */

const CONFIRM_VARIANTS = {
  approve: {
    title: "Approve Company?",
    description: (name) => (
      <>
        <span className="font-medium text-foreground">{name}</span> will be
        approved and listed on the platform. Recruiters under this company can
        start posting jobs immediately.
      </>
    ),
    icon: CheckCircle2,
    iconCls: "bg-primary/10 text-primary",
    actionLabel: "Approve",
    actionCls: cn(
      "h-9 rounded-lg px-4",
      "bg-primary text-primary-foreground",
      "font-sans text-[14px] font-medium",
      "hover:bg-primary/90",
      "focus-visible:ring-primary/50",
    ),
  },
  reject: {
    title: "Reject Company?",
    description: (name) => (
      <>
        <span className="font-medium text-foreground">{name}</span> will be
        rejected and removed from public listings. The recruiter will be
        notified and may re-apply after making changes.
      </>
    ),
    icon: AlertTriangle,
    iconCls: "bg-chart-4/10 text-chart-4",
    actionLabel: "Reject",
    actionCls: cn(
      "h-9 rounded-lg px-4",
      "bg-chart-4 text-white",
      "font-sans text-[14px] font-medium",
      "hover:bg-chart-4/90",
      "focus-visible:ring-chart-4/50",
    ),
  },
};

/* ════════════════════════════════════════════════════════════════════
   PRIMITIVES
   ════════════════════════════════════════════════════════════════════ */

/* ── Company logo mark (32px rounded-md) ── */
function CompanyMark({ initials }) {
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md",
        "border border-border bg-popover",
        "font-heading text-[11px] font-semibold leading-none text-primary",
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

/* ── Status badge ── */
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.Pending;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5",
        "font-sans text-[12px] font-medium",
        cfg.pillCls,
      )}
    >
      {status}
    </span>
  );
}

/* ── Filter pill ── */
function FilterPill({ label, active, count, countVariant, onClick }) {
  /* countVariant: "amber" for Pending attention badge */
  const badgeCls = active
    ? "bg-primary-foreground/20 text-primary-foreground"
    : countVariant === "amber"
      ? "bg-chart-2/20 text-chart-2"
      : "bg-border text-muted-foreground";

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
            badgeCls,
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/* ── Approve inline button ── */
function ApproveBtn({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "inline-flex h-7 items-center gap-1 rounded-md px-2.5",
        "bg-primary text-primary-foreground",
        "font-sans text-[12px] font-medium",
        "transition-all duration-150 hover:bg-primary/90",
        "hover:shadow-[0_2px_10px_-2px_color-mix(in_oklch,var(--primary)_35%,transparent)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <CheckCircle2 className="size-3" aria-hidden="true" />
      Approve
    </button>
  );
}

/* ── Reject inline button ── */
function RejectBtn({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "inline-flex h-7 items-center gap-1 rounded-md border border-chart-4/30 px-2.5",
        "bg-transparent text-chart-4",
        "font-sans text-[12px] font-medium",
        "transition-colors duration-150",
        "hover:border-chart-4 hover:bg-chart-4/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <XCircle className="size-3" aria-hidden="true" />
      Reject
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════
   RELATIVE DATE
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
   CONFIRM DIALOG
   ════════════════════════════════════════════════════════════════════ */

function ConfirmDialog({ pending, onConfirm, onCancel }) {
  if (!pending) return null;
  const variant = CONFIRM_VARIANTS[pending.action];
  const Icon = variant.icon;

  return (
    <AlertDialog
      open={!!pending}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className={variant.iconCls} aria-hidden="true">
            <Icon className="size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle className="font-heading text-[18px] font-semibold text-foreground">
            {variant.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-sans text-[14px] text-muted-foreground">
            {variant.description(pending.company.name)}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onCancel}
            className={cn(
              "h-9 rounded-lg border border-border bg-transparent px-4",
              "font-sans text-[14px] font-medium text-muted-foreground",
              "hover:border-border hover:bg-accent hover:text-foreground",
            )}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(pending)}
            className={variant.actionCls}
          >
            {variant.actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ════════════════════════════════════════════════════════════════════
   EMPTY STATE
   ════════════════════════════════════════════════════════════════════ */

function EmptyState() {
  return (
    <TableRow className="border-0 hover:bg-transparent">
      <TableCell colSpan={6} className="py-14 text-center">
        <p className="font-sans text-[14px] text-muted-foreground">
          No companies match this filter.
        </p>
      </TableCell>
    </TableRow>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */

export default function ManageCompaniesPage() {
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [activeFilter, setActiveFilter] = useState("All");
  /* pending = { action: "approve"|"reject", company } | null */
  const [pending, setPending] = useState(null);

  /* ── Counts per status ── */
  const counts = useMemo(() => {
    const map = { All: companies.length, Pending: 0, Approved: 0, Rejected: 0 };
    companies.forEach((c) => {
      map[c.status] = (map[c.status] ?? 0) + 1;
    });
    return map;
  }, [companies]);

  /* ── Filtered list ── */
  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? companies
        : companies.filter((c) => c.status === activeFilter),
    [companies, activeFilter],
  );

  /* ── Apply confirmed action ── */
  function handleConfirm({ action, company }) {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id !== company.id
          ? c
          : { ...c, status: action === "approve" ? "Approved" : "Rejected" },
      ),
    );
    setPending(null);
  }

  return (
    <div className="flex flex-col gap-7">
      {/* ══════════════════════════════════════════════════════════
          PAGE HEADER
          ══════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3">
        <h1 className="font-heading text-[28px] font-bold leading-tight text-foreground">
          Manage Companies
        </h1>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5",
            "font-sans text-[13px] font-semibold",
            "bg-primary/10 text-primary",
          )}
          aria-label={`${companies.length} total companies`}
        >
          {companies.length}
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════════
          FILTER ROW
          ══════════════════════════════════════════════════════════ */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter by status"
      >
        {FILTER_TABS.map((tab) => (
          <FilterPill
            key={tab}
            label={tab}
            active={activeFilter === tab}
            count={counts[tab]}
            /* amber attention badge only on Pending when not active */
            countVariant={tab === "Pending" ? "amber" : undefined}
            onClick={() => setActiveFilter(tab)}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════
          TABLE
          ══════════════════════════════════════════════════════════ */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table aria-label="Companies pending review">
          {/* Header */}
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              {[
                { label: "Company", cls: "pl-6 w-[200px]" },
                { label: "Recruiter Email", cls: "w-[220px]" },
                { label: "Industry", cls: "w-[200px]" },
                { label: "Submitted", cls: "w-[120px]" },
                { label: "Status", cls: "w-[120px]" },
                { label: "Actions", cls: "pr-6 w-[150px] text-right" },
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

          {/* Body */}
          <TableBody>
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              filtered.map((company) => (
                <CompanyRow
                  key={company.id}
                  company={company}
                  onAction={(action) => setPending({ action, company })}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ══════════════════════════════════════════════════════════
          CONFIRM DIALOG
          ══════════════════════════════════════════════════════════ */}
      <ConfirmDialog
        pending={pending}
        onConfirm={handleConfirm}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   COMPANY ROW  (extracted to keep JSX readable)
   ════════════════════════════════════════════════════════════════════ */

function CompanyRow({ company, onAction }) {
  const isPending = company.status === "Pending";
  const isApproved = company.status === "Approved";
  const isRejected = company.status === "Rejected";

  return (
    <TableRow
      className={cn(
        "border-border transition-colors duration-100",
        "hover:bg-popover",
      )}
    >
      {/* Company: logo + name */}
      <TableCell className="pl-6 py-3.5">
        <div className="flex items-center gap-3">
          <CompanyMark initials={company.initials} />
          <span className="font-sans text-[14px] font-medium text-foreground truncate max-w-35">
            {company.name}
          </span>
        </div>
      </TableCell>

      {/* Recruiter Email */}
      <TableCell className="py-3.5">
        <span className="font-sans text-[14px] text-muted-foreground truncate block max-w-47.5">
          {company.recruiterEmail}
        </span>
      </TableCell>

      {/* Industry */}
      <TableCell className="py-3.5">
        <span className="font-sans text-[14px] text-muted-foreground truncate block max-w-45">
          {company.industry}
        </span>
      </TableCell>

      {/* Submitted */}
      <TableCell className="py-3.5">
        <span className="font-sans text-[14px] text-muted-foreground whitespace-nowrap">
          {relativeDate(company.submittedAt)}
        </span>
      </TableCell>

      {/* Status */}
      <TableCell className="py-3.5">
        <StatusBadge status={company.status} />
      </TableCell>

      {/* Actions — conditional by status */}
      <TableCell className="pr-6 py-3.5">
        <div className="flex items-center justify-end gap-2">
          {/* Pending: Approve + Reject */}
          {isPending && (
            <>
              <ApproveBtn
                onClick={() => onAction("approve")}
                label={`Approve ${company.name}`}
              />
              <RejectBtn
                onClick={() => onAction("reject")}
                label={`Reject ${company.name}`}
              />
            </>
          )}

          {/* Approved: Reject only */}
          {isApproved && (
            <RejectBtn
              onClick={() => onAction("reject")}
              label={`Reject ${company.name}`}
            />
          )}

          {/* Rejected: Approve only */}
          {isRejected && (
            <ApproveBtn
              onClick={() => onAction("approve")}
              label={`Approve ${company.name}`}
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
