"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { BookmarkX, MapPin, Trash2 } from "lucide-react";
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

const NOW = new Date("2026-06-10T12:00:00Z");

function daysAgoDate(n) {
  const d = new Date(NOW);
  d.setDate(d.getDate() - n);
  return d;
}

const INITIAL_SAVED = [
  {
    id: 1,
    jobId: 1,
    title: "Senior Product Designer",
    type: "Full-time",
    company: "Figma",
    initials: "Fi",
    location: "San Francisco, CA",
    salary: "$130K – $160K",
    savedAt: daysAgoDate(0),
  },
  {
    id: 2,
    jobId: 2,
    title: "AI Platform Engineer",
    type: "Full-time",
    company: "Vercel",
    initials: "Ve",
    location: "Remote · Global",
    salary: "$150K – $185K",
    savedAt: daysAgoDate(1),
  },
  {
    id: 3,
    jobId: 5,
    title: "Growth Marketing Manager",
    type: "Full-time",
    company: "Notion",
    initials: "No",
    location: "Remote · US",
    salary: "$110K – $135K",
    savedAt: daysAgoDate(3),
  },
  {
    id: 4,
    jobId: 4,
    title: "Backend Engineer – Payments",
    type: "Full-time",
    company: "Stripe",
    initials: "St",
    location: "Dublin, Ireland",
    salary: "$140K – $175K",
    savedAt: daysAgoDate(5),
  },
  {
    id: 5,
    jobId: 7,
    title: "Data Scientist – Commerce",
    type: "Full-time",
    company: "Shopify",
    initials: "Sh",
    location: "Remote · Canada",
    salary: "$135K – $165K",
    savedAt: daysAgoDate(7),
  },
  {
    id: 6,
    jobId: 3,
    title: "DevOps Engineer",
    type: "Contract",
    company: "Linear",
    initials: "Li",
    location: "New York, NY",
    salary: "$120K – $148K",
    savedAt: daysAgoDate(9),
  },
  {
    id: 7,
    jobId: 9,
    title: "Developer Relations Engineer",
    type: "Full-time",
    company: "GitHub",
    initials: "Gh",
    location: "Remote · Global",
    salary: "$115K – $145K",
    savedAt: daysAgoDate(11),
  },
  {
    id: 8,
    jobId: 8,
    title: "Product Manager, Jira",
    type: "Full-time",
    company: "Atlassian",
    initials: "At",
    location: "Sydney, Australia",
    salary: "$120K – $155K",
    savedAt: daysAgoDate(14),
  },
  {
    id: 9,
    jobId: 6,
    title: "iOS Engineer",
    type: "Part-time",
    company: "Loom",
    initials: "Lo",
    location: "Austin, TX",
    salary: "$125K – $155K",
    savedAt: daysAgoDate(18),
  },
  {
    id: 10,
    jobId: 10,
    title: "Senior Sales Engineer",
    type: "Full-time",
    company: "HubSpot",
    initials: "Hu",
    location: "Boston, MA",
    salary: "$105K – $130K",
    savedAt: daysAgoDate(21),
  },
  {
    id: 11,
    jobId: 11,
    title: "Solutions Architect",
    type: "Contract",
    company: "Twilio",
    initials: "Tw",
    location: "San Francisco, CA",
    salary: "$145K – $175K",
    savedAt: daysAgoDate(24),
  },
  {
    id: 12,
    jobId: 12,
    title: "Customer Success Lead",
    type: "Full-time",
    company: "Intercom",
    initials: "In",
    location: "Dublin, Ireland",
    salary: "$90K – $115K",
    savedAt: daysAgoDate(28),
  },
];

/* ════════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════════ */

function relativeDate(date) {
  const diffMs = NOW - date;
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fullDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ════════════════════════════════════════════════════════════════════
   CUSTOM CHECKBOX
   Accessible native checkbox styled to match the design system.
   ════════════════════════════════════════════════════════════════════ */

function Checkbox({ checked, indeterminate = false, onChange, label, id }) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center"
      aria-label={label}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate;
        }}
        onChange={onChange}
        className={cn(
          /* Reset native appearance */
          "appearance-none",
          /* Size + shape */
          "size-4 shrink-0 rounded border border-border",
          /* Colours */
          "bg-card",
          /* Checked / indeterminate state */
          "checked:border-primary checked:bg-primary",
          "indeterminate:border-primary indeterminate:bg-primary",
          /* Checkmark via background SVG */
          "checked:bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M3.5%208l3%203%206-6%22%20stroke%3D%22%230A0D14%22%20stroke-width%3D%221.75%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')]",
          "indeterminate:bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cline%20x1%3D%224%22%20y1%3D%228%22%20x2%3D%2212%22%20y2%3D%228%22%20stroke%3D%22%230A0D14%22%20stroke-width%3D%221.75%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E')]",
          "bg-no-repeat bg-center",
          /* Focus ring */
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "cursor-pointer transition-colors duration-150",
        )}
      />
    </label>
  );
}

/* ════════════════════════════════════════════════════════════════════
   COMPANY LOGO MARK
   ════════════════════════════════════════════════════════════════════ */

function CompanyMark({ initials }) {
  return (
    <div
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md",
        "border border-border bg-secondary",
        "font-heading text-[10px] font-semibold leading-none text-primary",
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   EMPTY STATE
   ════════════════════════════════════════════════════════════════════ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-24 text-center">
      <BookmarkX
        className="size-12 text-muted-foreground"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <h2 className="mt-4 font-heading text-[18px] font-semibold text-foreground">
        No saved jobs yet
      </h2>
      <p className="mt-2 max-w-xs font-sans text-[14px] text-muted-foreground">
        Browse jobs and hit the bookmark icon to save them here.
      </p>
      <Link
        href="/dashboard/seeker/jobs"
        className={cn(
          "mt-6 inline-flex h-10 items-center justify-center rounded-lg px-5",
          "bg-primary text-primary-foreground",
          "font-sans text-[14px] font-medium",
          "hover:opacity-90 transition-opacity duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        Browse Jobs
      </Link>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   BULK ACTION BAR
   ════════════════════════════════════════════════════════════════════ */

function BulkActionBar({ count, onRemove }) {
  if (count === 0) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`${count} job${count !== 1 ? "s" : ""} selected`}
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary px-4 py-3",
      )}
    >
      <span className="font-sans text-[14px] font-medium text-foreground">
        {count} job{count !== 1 ? "s" : ""} selected
      </span>
      <button
        type="button"
        onClick={onRemove}
        className={cn(
          "inline-flex h-9 items-center justify-center rounded-lg border border-destructive/30 px-4",
          "font-sans text-[14px] font-medium text-destructive",
          "bg-transparent hover:bg-destructive/10",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        Remove Selected
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */

export default function SavedJobsPage() {
  const [saved, setSaved] = useState(INITIAL_SAVED);
  const [selected, setSelected] = useState(new Set());

  const headerId = useId();

  /* ── Selection helpers ── */
  const allSelected = saved.length > 0 && selected.size === saved.length;
  const someSelected = selected.size > 0 && selected.size < saved.length;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(saved.map((j) => j.id)));
    }
  }

  function toggleRow(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  /* ── Remove actions ── */
  function removeOne(id) {
    setSaved((prev) => prev.filter((j) => j.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function removeSelected() {
    setSaved((prev) => prev.filter((j) => !selected.has(j.id)));
    setSelected(new Set());
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ══════════════════════════════════════════════════════════
          PAGE HEADER
          ══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1
            id={headerId}
            className="font-heading text-[28px] font-bold leading-tight text-foreground"
          >
            Saved Jobs
          </h1>
          {saved.length > 0 && (
            <span
              className={cn(
                "inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5",
                "font-sans text-[13px] font-semibold text-primary",
              )}
              aria-label={`${saved.length} saved jobs`}
            >
              {saved.length}
            </span>
          )}
        </div>
        <p className="font-sans text-[14px] text-muted-foreground">
          Jobs you&apos;ve bookmarked for later.
        </p>
      </div>

      {saved.length === 0 ? (
        /* ══════════════════════════════════════════════════════════
            EMPTY STATE
            ══════════════════════════════════════════════════════════ */
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3">
          {/* ══════════════════════════════════════════════════════════
              BULK ACTION BAR
              ══════════════════════════════════════════════════════════ */}
          <BulkActionBar count={selected.size} onRemove={removeSelected} />

          {/* ══════════════════════════════════════════════════════════
              TABLE
              ══════════════════════════════════════════════════════════ */}
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <Table aria-labelledby={headerId}>
              {/* ── Header ── */}
              <TableHeader>
                <TableRow className="border-b border-border bg-secondary hover:bg-secondary">
                  {/* Select-all checkbox */}
                  <TableHead className="w-10 pl-4 py-3">
                    <Checkbox
                      id="select-all"
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={toggleAll}
                      label={allSelected ? "Deselect all" : "Select all"}
                    />
                  </TableHead>

                  {[
                    { label: "Job", cls: "pl-2 min-w-[200px]" },
                    { label: "Company", cls: "min-w-[150px]" },
                    { label: "Location", cls: "min-w-[160px]" },
                    { label: "Salary", cls: "min-w-[150px]" },
                    { label: "Date Saved", cls: "min-w-[120px]" },
                    { label: "Actions", cls: "pr-4 min-w-[130px] text-right" },
                  ].map(({ label, cls }) => (
                    <TableHead
                      key={label}
                      className={cn(
                        "py-3 font-sans text-[11px] font-medium uppercase tracking-widest text-muted-foreground",
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
                {saved.map((job) => {
                  const isSelected = selected.has(job.id);
                  return (
                    <TableRow
                      key={job.id}
                      data-state={isSelected ? "selected" : undefined}
                      className={cn(
                        "h-16 border-b border-border transition-colors duration-100",
                        "hover:bg-secondary",
                        isSelected && "bg-primary/5 hover:bg-primary/5",
                      )}
                    >
                      {/* ── Checkbox ── */}
                      <TableCell className="w-10 pl-4">
                        <Checkbox
                          id={`row-${job.id}`}
                          checked={isSelected}
                          onChange={() => toggleRow(job.id)}
                          label={`Select ${job.title}`}
                        />
                      </TableCell>

                      {/* ── Job ── */}
                      <TableCell className="pl-2">
                        <div className="flex flex-col gap-1">
                          <Link
                            href={`/jobs/${job.jobId}`}
                            className={cn(
                              "font-heading text-[15px] font-semibold leading-snug text-foreground",
                              "transition-colors duration-150 hover:text-primary",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
                            )}
                          >
                            {job.title}
                          </Link>
                          <span
                            className={cn(
                              "inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5",
                              "font-sans text-[11px] text-primary",
                            )}
                          >
                            {job.type}
                          </span>
                        </div>
                      </TableCell>

                      {/* ── Company ── */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CompanyMark initials={job.initials} />
                          <span className="font-sans text-[14px] text-foreground">
                            {job.company}
                          </span>
                        </div>
                      </TableCell>

                      {/* ── Location ── */}
                      <TableCell>
                        <span className="flex items-center gap-1.5 font-sans text-[14px] text-muted-foreground">
                          <MapPin
                            className="size-3.5 shrink-0"
                            aria-hidden="true"
                          />
                          {job.location}
                        </span>
                      </TableCell>

                      {/* ── Salary ── */}
                      <TableCell>
                        <span className="font-heading text-[14px] font-semibold text-primary">
                          {job.salary}
                        </span>
                      </TableCell>

                      {/* ── Date Saved — native title tooltip ── */}
                      <TableCell>
                        <time
                          dateTime={job.savedAt.toISOString()}
                          title={fullDate(job.savedAt)}
                          className={cn(
                            "font-sans text-[13px] text-muted-foreground",
                            "cursor-default underline decoration-dashed decoration-muted-foreground/40 underline-offset-2",
                          )}
                        >
                          {relativeDate(job.savedAt)}
                        </time>
                      </TableCell>

                      {/* ── Actions ── */}
                      <TableCell className="pr-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Apply button */}
                          <Link
                            href={`/dashboard/seeker/jobs`}
                            className={cn(
                              "inline-flex h-8 items-center justify-center rounded-lg px-3",
                              "bg-primary text-primary-foreground",
                              "font-sans text-[13px] font-medium",
                              "hover:opacity-90 transition-opacity duration-150",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            )}
                            aria-label={`Apply for ${job.title}`}
                          >
                            Apply
                          </Link>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => removeOne(job.id)}
                            aria-label={`Remove ${job.title} from saved jobs`}
                            className={cn(
                              "flex size-8 items-center justify-center rounded-lg border border-border",
                              "text-muted-foreground bg-transparent",
                              "hover:border-destructive hover:text-destructive",
                              "transition-colors duration-150",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            )}
                          >
                            <Trash2 className="size-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
