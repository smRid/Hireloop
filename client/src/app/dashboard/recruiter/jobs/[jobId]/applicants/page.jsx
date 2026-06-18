"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Mail,
  MapPin,
  Building2,
  Clock,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════════
   MOCK DATA
   ════════════════════════════════════════════════════════════════════ */

const MOCK_JOB = {
  id: 1,
  title: "Senior Product Designer",
  company: "NovaBridge",
  location: "San Francisco, CA",
  postedAt: "Jun 3, 2026",
};

const NOW = new Date("2026-06-07T12:00:00Z");

function daysAgoISO(n) {
  const d = new Date(NOW);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const INITIAL_APPLICANTS = [
  {
    id: 1,
    name: "Sarah Chen",
    initials: "SC",
    email: "sarah.chen@example.com",
    appliedAt: daysAgoISO(0),
    resumeUrl: "#",
    status: "Shortlisted",
  },
  {
    id: 2,
    name: "Marcus Webb",
    initials: "MW",
    email: "marcus.webb@example.com",
    appliedAt: daysAgoISO(1),
    resumeUrl: "#",
    status: "Under Review",
  },
  {
    id: 3,
    name: "Priya Nair",
    initials: "PN",
    email: "priya.nair@example.com",
    appliedAt: daysAgoISO(1),
    resumeUrl: "#",
    status: "Applied",
  },
  {
    id: 4,
    name: "James Okafor",
    initials: "JO",
    email: "james.okafor@example.com",
    appliedAt: daysAgoISO(2),
    resumeUrl: "#",
    status: "Rejected",
  },
  {
    id: 5,
    name: "Lena Müller",
    initials: "LM",
    email: "lena.muller@example.com",
    appliedAt: daysAgoISO(3),
    resumeUrl: "#",
    status: "Offered",
  },
  {
    id: 6,
    name: "David Park",
    initials: "DP",
    email: "david.park@example.com",
    appliedAt: daysAgoISO(3),
    resumeUrl: "#",
    status: "Under Review",
  },
  {
    id: 7,
    name: "Amara Diallo",
    initials: "AD",
    email: "amara.diallo@example.com",
    appliedAt: daysAgoISO(4),
    resumeUrl: "#",
    status: "Shortlisted",
  },
  {
    id: 8,
    name: "Tom Eriksson",
    initials: "TE",
    email: "tom.eriksson@example.com",
    appliedAt: daysAgoISO(5),
    resumeUrl: "#",
    status: "Applied",
  },
  {
    id: 9,
    name: "Yuki Tanaka",
    initials: "YT",
    email: "yuki.tanaka@example.com",
    appliedAt: daysAgoISO(6),
    resumeUrl: "#",
    status: "Shortlisted",
  },
  {
    id: 10,
    name: "Nadia Rossi",
    initials: "NR",
    email: "nadia.rossi@example.com",
    appliedAt: daysAgoISO(7),
    resumeUrl: "#",
    status: "Offered",
  },
  {
    id: 11,
    name: "Carlos Mendez",
    initials: "CM",
    email: "carlos.mendez@example.com",
    appliedAt: daysAgoISO(9),
    resumeUrl: "#",
    status: "Applied",
  },
  {
    id: 12,
    name: "Fatima Al-Rashid",
    initials: "FA",
    email: "fatima.alrashid@example.com",
    appliedAt: daysAgoISO(11),
    resumeUrl: "#",
    status: "Rejected",
  },
];

/* ════════════════════════════════════════════════════════════════════
   STATUS CONFIG
   ════════════════════════════════════════════════════════════════════ */

const STATUS_CONFIG = {
  Applied: {
    label: "Applied",
    /* muted text — "secondary" tone */
    triggerCls: "text-muted-foreground",
    pillCls: "bg-secondary text-secondary-foreground",
  },
  "Under Review": {
    label: "Under Review",
    triggerCls: "text-chart-2",
    pillCls: "bg-chart-2/10 text-chart-2",
  },
  Shortlisted: {
    label: "Shortlisted",
    triggerCls: "text-primary",
    pillCls: "bg-primary/10 text-primary",
  },
  Rejected: {
    label: "Rejected",
    triggerCls: "text-chart-4",
    pillCls: "bg-chart-4/10 text-chart-4",
  },
  Offered: {
    label: "Offered",
    /* green — chart-3 */
    triggerCls: "text-chart-3",
    pillCls: "bg-chart-3/10 text-chart-3",
  },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG);

/* ════════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════════ */

function relativeDate(isoString) {
  const date = new Date(isoString);
  const diffDays = Math.floor((NOW - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ════════════════════════════════════════════════════════════════════
   PRIMITIVES
   ════════════════════════════════════════════════════════════════════ */

/* ── Applicant initials avatar (32px) ── */
function ApplicantAvatar({ initials }) {
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

/* ── Summary pill (header stats) ── */
function SummaryPill({ label, pillCls }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1",
        "font-sans text-[13px] font-medium",
        pillCls,
      )}
    >
      {label}
    </span>
  );
}

/* ── Status select (per row) ── */
function StatusSelect({ applicantId, currentStatus, onChange }) {
  const cfg = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG.Applied;

  return (
    <Select
      value={currentStatus}
      onValueChange={(v) => onChange(applicantId, v)}
    >
      <SelectTrigger
        aria-label={`Status for applicant`}
        className={cn(
          /* match row height, minimal chrome */
          "h-8 w-36 rounded-lg border border-border bg-popover px-2.5",
          "font-sans text-[13px] font-medium",
          "outline-none transition-colors duration-150",
          "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
          /* coloured trigger label */
          cfg.triggerCls,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          {ALL_STATUSES.map((s) => (
            <SelectItem
              key={s}
              value={s}
              className={cn(
                "font-sans text-[13px]",
                STATUS_CONFIG[s].triggerCls,
              )}
            >
              {s}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

/* ── Ghost icon button ── */
function IconBtn({ label, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg",
        "border border-transparent",
        "text-muted-foreground",
        "transition-colors duration-150",
        "hover:border-border hover:bg-popover hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      {children}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════
   EMPTY STATE
   ════════════════════════════════════════════════════════════════════ */

function EmptyState() {
  return (
    <TableRow className="hover:bg-transparent border-0">
      <TableCell colSpan={5} className="py-20">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          {/* Person-with-magnifier illustration */}
          <div
            className={cn(
              "flex size-20 items-center justify-center rounded-2xl",
              "border border-border bg-popover",
            )}
            aria-hidden="true"
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground/40"
            >
              {/* Person silhouette */}
              <circle cx="18" cy="14" r="5" />
              <path d="M8 36c0-5.523 4.477-10 10-10h1" />
              {/* Magnifier */}
              <circle cx="30" cy="30" r="6" />
              <line x1="34.24" y1="34.24" x2="38" y2="38" />
            </svg>
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-heading text-[18px] font-semibold text-foreground">
              No applicants yet
            </h3>
            <p className="font-sans text-[14px] text-muted-foreground max-w-xs">
              Applications will appear here once candidates start applying to
              this role.
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */

export default function ApplicantsPage() {
  const router = useRouter();
  const job = MOCK_JOB;
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);

  /* ── Derive stats from live state ── */
  const total = applicants.length;
  const shortlisted = applicants.filter(
    (a) => a.status === "Shortlisted",
  ).length;
  const offered = applicants.filter((a) => a.status === "Offered").length;

  function handleStatusChange(id, newStatus) {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );
  }

  function handleSendEmail(applicant) {
    /* TODO: wire to email/messaging flow */
    window.location.href = `mailto:${applicant.email}`;
  }

  return (
    <div className="flex flex-col gap-7">
      {/* ══════════════════════════════════════════════════════════
          PAGE HEADER
          ══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-4">
        {/* Back link */}
        <button
          type="button"
          onClick={() => router.push("/dashboard/recruiter/jobs")}
          aria-label="Back to Manage Jobs"
          className={cn(
            "self-start -ml-1 flex items-center gap-1.5 rounded-md px-1 py-0.5",
            "font-sans text-[13px] text-muted-foreground",
            "transition-colors hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Manage Jobs
        </button>

        {/* Title */}
        <h1 className="font-heading text-[24px] font-semibold leading-tight text-foreground">
          Applicants for: <span className="text-primary">{job.title}</span>
        </h1>

        {/* Meta row */}
        <div
          className="flex flex-wrap items-center gap-x-3 gap-y-1"
          aria-label="Job details"
        >
          <span className="inline-flex items-center gap-1.5 font-sans text-[14px] text-muted-foreground">
            <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
            {job.company}
          </span>

          <span
            className="text-border font-sans text-[14px]"
            aria-hidden="true"
          >
            ·
          </span>

          <span className="inline-flex items-center gap-1.5 font-sans text-[14px] text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            {job.location}
          </span>

          <span
            className="text-border font-sans text-[14px]"
            aria-hidden="true"
          >
            ·
          </span>

          <span className="inline-flex items-center gap-1.5 font-sans text-[14px] text-muted-foreground">
            <Clock className="size-3.5 shrink-0" aria-hidden="true" />
            Posted {job.postedAt}
          </span>
        </div>

        {/* Stats pills */}
        <div
          className="flex flex-wrap items-center gap-2"
          aria-label="Applicant summary"
          role="status"
        >
          <SummaryPill
            label={`${total} Total`}
            pillCls="bg-secondary text-secondary-foreground"
          />
          <SummaryPill
            label={`${shortlisted} Shortlisted`}
            pillCls="bg-primary/10 text-primary"
          />
          <SummaryPill
            label={`${offered} Offered`}
            pillCls="bg-chart-3/10 text-chart-3"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          TABLE
          ══════════════════════════════════════════════════════════ */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table aria-label={`Applicants for ${job.title}`}>
          {/* ── Header ── */}
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              {[
                { label: "Applicant", cls: "pl-6 w-[260px]" },
                { label: "Date Applied", cls: "w-[130px]" },
                { label: "Resume", cls: "w-[110px]" },
                { label: "Status", cls: "w-[160px]" },
                { label: "Action", cls: "pr-6 w-[72px] text-right" },
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
            {applicants.length === 0 ? (
              <EmptyState />
            ) : (
              applicants.map((applicant) => (
                <ApplicantRow
                  key={applicant.id}
                  applicant={applicant}
                  onStatusChange={handleStatusChange}
                  onEmail={handleSendEmail}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   APPLICANT ROW  (extracted to avoid re-render of full list)
   ════════════════════════════════════════════════════════════════════ */

function ApplicantRow({ applicant, onStatusChange, onEmail }) {
  return (
    <TableRow
      className={cn(
        "border-border transition-colors duration-100",
        "hover:bg-popover",
      )}
    >
      {/* ── Applicant: avatar + name + email ── */}
      <TableCell className="pl-6 py-3.5">
        <div className="flex items-center gap-3">
          <ApplicantAvatar initials={applicant.initials} />
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="font-sans text-[14px] font-medium leading-snug text-foreground truncate">
              {applicant.name}
            </span>
            <span className="font-sans text-[12px] leading-snug text-muted-foreground truncate">
              {applicant.email}
            </span>
          </div>
        </div>
      </TableCell>

      {/* ── Date Applied ── */}
      <TableCell className="py-3.5">
        <span className="font-sans text-[14px] text-muted-foreground whitespace-nowrap">
          {relativeDate(applicant.appliedAt)}
        </span>
      </TableCell>

      {/* ── Resume link ── */}
      <TableCell className="py-3.5">
        <a
          href={applicant.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View resume for ${applicant.name}`}
          className={cn(
            "inline-flex items-center gap-1.5 font-sans text-[14px] font-medium text-primary",
            "transition-colors duration-150 hover:text-primary/75",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
          )}
        >
          View PDF
          <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
        </a>
      </TableCell>

      {/* ── Status select ── */}
      <TableCell className="py-3.5">
        <StatusSelect
          applicantId={applicant.id}
          currentStatus={applicant.status}
          onChange={onStatusChange}
        />
      </TableCell>

      {/* ── Action: Send Email ── */}
      <TableCell className="pr-6 py-3.5">
        <div className="flex justify-end">
          <IconBtn
            label={`Send email to ${applicant.name}`}
            onClick={() => onEmail(applicant)}
          >
            <Mail className="size-4" aria-hidden="true" />
          </IconBtn>
        </div>
      </TableCell>
    </TableRow>
  );
}
