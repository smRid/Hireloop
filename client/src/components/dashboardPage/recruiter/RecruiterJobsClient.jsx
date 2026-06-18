"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, Pencil, Plus, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import CompanyLogo from "@/components/shared/CompanyLogo";
import DashboardPanel from "@/components/shared/DashboardPanel";
import PageHeader from "@/components/shared/PageHeader";
import StatusPill from "@/components/shared/StatusPill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteJob, updateJob } from "@/lib/actions/jobs";
import { cn } from "@/lib/utils";

const getId = (item) => item?._id ?? item?.id ?? "";

const formatDate = (date) => {
  if (!date) return "Not posted";
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const titleForJob = (job) => job.jobTitle ?? job.title ?? "Untitled job";

function IconButton({ label, children, className, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg",
        "text-muted-foreground transition-colors hover:bg-popover hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default function RecruiterJobsClient({
  initialJobs = [],
  planLimit = 10,
}) {
  const router = useRouter();
  const [jobs, setJobs] = useState(initialJobs);
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();
  const activeCount = jobs.filter((job) => job.status === "active").length;
  const atLimit = activeCount >= planLimit;
  const usedPercent = Math.min(100, (activeCount / planLimit) * 100);

  function closeJob(job) {
    startTransition(async () => {
      const result = await updateJob(getId(job), { status: "closed" });

      if (result.error) {
        setFeedback(result.error);
        return;
      }

      setJobs((current) =>
        current.map((item) =>
          getId(item) === getId(job) ? { ...item, status: "closed" } : item,
        ),
      );
      setFeedback("Job closed.");
      router.refresh();
    });
  }

  function removeJob(job) {
    const confirmed = window.confirm(`Delete ${titleForJob(job)}?`);
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteJob(getId(job));

      if (result.error) {
        setFeedback(result.error);
        return;
      }

      setJobs((current) => current.filter((item) => getId(item) !== getId(job)));
      setFeedback("Job deleted.");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-7">
      <PageHeader
        title="Manage Jobs"
        description="Track active, draft, and closed roles from your approved companies."
        actions={
          <Link
            href="/dashboard/recruiter/jobs/new"
            aria-disabled={atLimit}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4",
              "font-sans text-[14px] font-medium text-primary-foreground",
              "transition-colors hover:bg-primary/90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              atLimit && "pointer-events-none opacity-50",
            )}
          >
            <Plus className="size-4" aria-hidden="true" />
            Post Job
          </Link>
        }
      />

      <DashboardPanel className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-sans text-[14px] text-muted-foreground">
            <span className="font-medium text-foreground">{activeCount}</span>
            {" / "}
            <span>{planLimit}</span> active job posts used
          </p>
          {atLimit && (
            <StatusPill status="closed" className="border-chart-2/20 text-chart-2">
              Plan limit reached
            </StatusPill>
          )}
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-popover"
          role="progressbar"
          aria-valuenow={activeCount}
          aria-valuemin={0}
          aria-valuemax={planLimit}
        >
          <div className="h-full rounded-full bg-primary" style={{ width: `${usedPercent}%` }} />
        </div>
      </DashboardPanel>

      {feedback && (
        <p className="font-sans text-[13px] text-muted-foreground" role="status">
          {feedback}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table aria-label="Recruiter job postings">
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="pl-6">Job</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applicants</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-16 text-center">
                  <p className="font-sans text-[14px] text-muted-foreground">
                    No job posts yet. Post your first role from an approved company.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={getId(job)} className="border-border hover:bg-popover">
                  <TableCell className="pl-6 py-3.5">
                    <div className="flex min-w-0 flex-col">
                      <span className="font-sans text-[14px] font-medium text-foreground">
                        {titleForJob(job)}
                      </span>
                      <span className="font-sans text-[12px] text-muted-foreground">
                        {job.jobType ?? "Job type unset"} - {job.location ?? "Location unset"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2">
                      <CompanyLogo name={job.companyName} size="sm" />
                      <span className="font-sans text-[14px] text-muted-foreground">
                        {job.companyName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <StatusPill status={job.status} />
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="font-heading text-[15px] font-semibold text-primary">
                      {job.applicantsCount ?? 0}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="font-sans text-[14px] text-muted-foreground">
                      {formatDate(job.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="pr-6 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/dashboard/recruiter/jobs/${getId(job)}/edit`}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-popover hover:text-foreground"
                        aria-label={`Edit ${titleForJob(job)}`}
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </Link>
                      <Link
                        href={`/dashboard/recruiter/jobs/${getId(job)}/applicants`}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-popover hover:text-foreground"
                        aria-label={`View applicants for ${titleForJob(job)}`}
                      >
                        <Eye className="size-4" aria-hidden="true" />
                      </Link>
                      {job.status === "active" && (
                        <IconButton
                          label={`Close ${titleForJob(job)}`}
                          onClick={() => closeJob(job)}
                          disabled={isPending}
                        >
                          <XCircle className="size-4" aria-hidden="true" />
                        </IconButton>
                      )}
                      <IconButton
                        label={`Delete ${titleForJob(job)}`}
                        onClick={() => removeJob(job)}
                        disabled={isPending}
                        className="hover:text-destructive"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </IconButton>
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
