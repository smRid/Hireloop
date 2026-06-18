"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Users,
  MoreHorizontal,
  XCircle,
  Trash2,
  AlertTriangle,
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
   PLAN QUOTA
   ════════════════════════════════════════════════════════════════════ */
const PLAN_LIMIT = 10;
const ACTIVE_USED = 7; /* mock — active posts counting against quota */

/* ════════════════════════════════════════════════════════════════════
   MOCK DATA
   ════════════════════════════════════════════════════════════════════ */

/* Timestamps as ISO strings so relative formatting stays stable */
const NOW = new Date("2026-06-07T12:00:00Z");

function daysAgoISO(n) {
  const d = new Date(NOW);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const INITIAL_JOBS = [
  {
    id: 1,
    title: "Senior Product Designer",
    company: "NovaBridge",
    companyInitials: "NB",
    status: "Active",
    applicants: 24,
    postedAt: daysAgoISO(1),
  },
  {
    id: 2,
    title: "AI Platform Engineer",
    company: "Solvora",
    companyInitials: "So",
    status: "Active",
    applicants: 41,
    postedAt: daysAgoISO(3),
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "NovaBridge",
    companyInitials: "NB",
    status: "Draft",
    applicants: 0,
    postedAt: daysAgoISO(3),
  },
  {
    id: 4,
    title: "Backend Engineer – Payments",
    company: "NovaBridge",
    companyInitials: "NB",
    status: "Closed",
    applicants: 67,
    postedAt: daysAgoISO(18),
  },
  {
    id: 5,
    title: "Growth Marketing Manager",
    company: "Archform",
    companyInitials: "Ar",
    status: "Active",
    applicants: 18,
    postedAt: daysAgoISO(5),
  },
  {
    id: 6,
    title: "iOS Engineer",
    company: "Solvora",
    companyInitials: "So",
    status: "Active",
    applicants: 9,
    postedAt: daysAgoISO(7),
  },
  {
    id: 7,
    title: "Data Scientist – Commerce",
    company: "Archform",
    companyInitials: "Ar",
    status: "Draft",
    applicants: 0,
    postedAt: daysAgoISO(0),
  },
  {
    id: 8,
    title: "Customer Success Lead",
    company: "NovaBridge",
    companyInitials: "NB",
    status: "Closed",
    applicants: 33,
    postedAt: daysAgoISO(45),
  },
  {
    id: 9,
    title: "Solutions Architect",
    company: "Solvora",
    companyInitials: "So",
    status: "Active",
    applicants: 15,
    postedAt: daysAgoISO(2),
  },
  {
    id: 10,
    title: "Product Manager, Platform",
    company: "Archform",
    companyInitials: "Ar",
    status: "Active",
    applicants: 28,
    postedAt: daysAgoISO(10),
  },
];

/* ════════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════════ */

/** Relative date: "Today", "Yesterday", "3 days ago", "Jun 5" for older */
function relativeDate(isoString) {
  const date = new Date(isoString);
  const diffMs = NOW - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ════════════════════════════════════════════════════════════════════
   PRIMITIVES
   ════════════════════════════════════════════════════════════════════ */

/* ── Company mark (24px) ── */
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

/* ── Job status badge ── */
const JOB_STATUS = {
  Active: {
    cls: "bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  Closed: {
    cls: "bg-secondary text-muted-foreground",
    dot: "bg-muted-foreground/40",
  },
  Draft: {
    cls: "bg-chart-2/10 text-chart-2",
    dot: "bg-chart-2",
  },
};

function JobStatusBadge({ status }) {
  const cfg = JOB_STATUS[status] ?? JOB_STATUS.Draft;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5",
        "font-sans text-[12px] font-medium",
        cfg.cls,
      )}
    >
      {/* Coloured dot */}
      <span
        className={cn("size-1.5 rounded-full shrink-0", cfg.dot)}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}

/* ── Icon action button ── */
function IconBtn({ onClick, label, children, variant = "default" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md",
        "transition-colors duration-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        variant === "destructive"
          ? "text-muted-foreground hover:bg-chart-4/10 hover:text-chart-4"
          : "text-muted-foreground hover:bg-popover hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MORE MENU  (ellipsis dropdown — Close / Delete)
   ════════════════════════════════════════════════════════════════════ */

function MoreMenu({ job, onClose, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <IconBtn label="More options" onClick={() => setOpen((v) => !v)}>
        <MoreHorizontal className="size-4" aria-hidden="true" />
      </IconBtn>

      {open && (
        <ul
          role="menu"
          aria-label={`More options for ${job.title}`}
          className={cn(
            "absolute right-0 top-full z-20 mt-1 w-40",
            "rounded-xl border border-border bg-popover py-1",
            "shadow-[0_8px_24px_-4px_color-mix(in_oklch,var(--background)_50%,transparent)]",
          )}
        >
          {/* Close job — only shown if Active */}
          {job.status === "Active" && (
            <li role="menuitem">
              <button
                type="button"
                onClick={() => {
                  onClose(job.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2",
                  "font-sans text-[13px] text-muted-foreground",
                  "transition-colors hover:bg-accent hover:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                )}
              >
                <XCircle className="size-3.5 shrink-0" aria-hidden="true" />
                Close Job
              </button>
            </li>
          )}

          {/* Delete */}
          <li role="menuitem">
            <button
              type="button"
              onClick={() => {
                onDelete(job);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2.5 px-3 py-2",
                "font-sans text-[13px] text-chart-4",
                "transition-colors hover:bg-chart-4/10",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
              )}
            >
              <Trash2 className="size-3.5 shrink-0" aria-hidden="true" />
              Delete
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   DELETE CONFIRM  (AlertDialog)
   ════════════════════════════════════════════════════════════════════ */

function DeleteConfirmDialog({ job, onConfirm, onCancel }) {
  return (
    <AlertDialog
      open={!!job}
      onOpenChange={(o) => {
        if (!o) onCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia
            className="bg-chart-4/10 text-chart-4"
            aria-hidden="true"
          >
            <AlertTriangle className="size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle className="font-heading text-[18px] font-semibold text-foreground">
            Delete job posting?
          </AlertDialogTitle>
          <AlertDialogDescription className="font-sans text-[14px] text-muted-foreground">
            <span className="font-medium text-foreground">{job?.title}</span>{" "}
            will be permanently removed along with all applicant data. This
            cannot be undone.
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
            onClick={() => onConfirm(job.id)}
            className={cn(
              "h-9 rounded-lg px-4",
              "bg-chart-4 text-white",
              "font-sans text-[14px] font-medium",
              "hover:bg-chart-4/90",
              "focus-visible:ring-chart-4/50",
            )}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PLAN USAGE BAR
   ════════════════════════════════════════════════════════════════════ */

function PlanUsageBar({ used, limit }) {
  const pct = Math.min((used / limit) * 100, 100);
  const nearLimit = pct >= 80;
  const atLimit = used >= limit;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Bar */}
      <div
        className="h-2 w-50 shrink-0 overflow-hidden rounded-full bg-popover border border-border"
        role="progressbar"
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-label={`${used} of ${limit} active job posts used`}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            atLimit ? "bg-chart-4" : nearLimit ? "bg-chart-2" : "bg-primary",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Label */}
      <p
        className={cn(
          "font-sans text-[14px]",
          atLimit
            ? "text-chart-4"
            : nearLimit
              ? "text-chart-2"
              : "text-muted-foreground",
        )}
      >
        <span className="font-medium text-foreground">{used}</span>
        {" / "}
        <span>{limit}</span>
        {" Active Job Posts Used"}
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */

export default function ManageJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [deleteTarget, setDeleteTarget] =
    useState(null); /* job object | null */

  /* Live count of active posts — re-derived from state */
  const activeCount = jobs.filter((j) => j.status === "Active").length;
  const atLimit = activeCount >= PLAN_LIMIT;

  function handleClose(id) {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: "Closed" } : j)),
    );
  }

  function handleDeleteConfirm(id) {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setDeleteTarget(null);
  }

  return (
    <div className="flex flex-col gap-7">
      {/* ════════════════════════════════════
          PAGE HEADER
          ════════════════════════════════════ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: title + usage bar */}
        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-[28px] font-bold leading-tight text-foreground">
            Manage Jobs
          </h1>
          <PlanUsageBar used={activeCount} limit={PLAN_LIMIT} />
        </div>

        {/* Right: Post New Job */}
        <Link
          href="/dashboard/recruiter/jobs/new"
          aria-disabled={atLimit}
          tabIndex={atLimit ? -1 : undefined}
          className={cn(
            "inline-flex shrink-0 h-10 items-center gap-2 rounded-xl px-5",
            "bg-primary text-primary-foreground",
            "font-sans text-[14px] font-medium",
            "transition-all duration-150",
            atLimit
              ? "opacity-40 cursor-not-allowed pointer-events-none"
              : [
                  "hover:bg-primary/90",
                  "hover:shadow-[0_4px_20px_-2px_color-mix(in_oklch,var(--primary)_30%,transparent)]",
                ],
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
          aria-label={
            atLimit ? "Post new job — plan limit reached" : "Post new job"
          }
        >
          <Plus className="size-4" aria-hidden="true" />
          Post New Job
        </Link>
      </div>

      {/* ════════════════════════════════════
          TABLE
          ════════════════════════════════════ */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table aria-label="Job postings">
          {/* ── Header ── */}
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              {[
                { label: "Job Title", cls: "pl-6 w-[240px]" },
                { label: "Company", cls: "w-[160px]" },
                { label: "Status", cls: "w-[110px]" },
                { label: "Applicants", cls: "w-[110px]" },
                { label: "Date Posted", cls: "w-[130px]" },
                { label: "Actions", cls: "pr-6 w-[108px] text-right" },
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
            {jobs.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-16 text-center">
                  <p className="font-sans text-[14px] text-muted-foreground">
                    No job postings yet.{" "}
                    <Link
                      href="/dashboard/recruiter/jobs/new"
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      Post your first job →
                    </Link>
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow
                  key={job.id}
                  className={cn(
                    "border-border transition-colors duration-100",
                    "hover:bg-popover",
                  )}
                >
                  {/* Job Title */}
                  <TableCell className="pl-6 py-3.5">
                    <span className="font-sans text-[14px] font-medium text-primary">
                      {job.title}
                    </span>
                  </TableCell>

                  {/* Company */}
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2">
                      <CompanyMark initials={job.companyInitials} />
                      <span className="font-sans text-[14px] text-muted-foreground truncate max-w-30">
                        {job.company}
                      </span>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3.5">
                    <JobStatusBadge status={job.status} />
                  </TableCell>

                  {/* Applicants */}
                  <TableCell className="py-3.5">
                    <span className="font-heading text-[14px] font-semibold text-primary">
                      {job.applicants}
                    </span>
                  </TableCell>

                  {/* Date Posted */}
                  <TableCell className="py-3.5">
                    <span className="font-sans text-[14px] text-muted-foreground whitespace-nowrap">
                      {relativeDate(job.postedAt)}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="pr-6 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {/* Edit */}
                      <IconBtn label={`Edit ${job.title}`}>
                        <Pencil className="size-3.5" aria-hidden="true" />
                      </IconBtn>

                      {/* View Applicants */}
                      <IconBtn
                        label={`View applicants for ${job.title}`}
                        onClick={() =>
                          router.push(
                            `/dashboard/recruiter/jobs/${job.id}/applicants`,
                          )
                        }
                      >
                        <Users className="size-3.5" aria-hidden="true" />
                      </IconBtn>

                      {/* More menu */}
                      <MoreMenu
                        job={job}
                        onClose={handleClose}
                        onDelete={(j) => setDeleteTarget(j)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ════════════════════════════════════
          DELETE CONFIRM DIALOG
          ════════════════════════════════════ */}
      <DeleteConfirmDialog
        job={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
