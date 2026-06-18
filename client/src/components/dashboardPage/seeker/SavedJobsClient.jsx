"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { BookmarkX, MapPin, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import CompanyLogo from "@/components/shared/CompanyLogo";
import PageHeader from "@/components/shared/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { removeSavedJob } from "@/lib/actions/saved-jobs";
import { cn } from "@/lib/utils";

const getId = (item) => item?._id ?? item?.id ?? "";

const formatDate = (date) => {
  if (!date) return "Unknown";
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatSalary = (job) => {
  if (job.salaryRange) return job.salaryRange;
  if (job.salaryMin && job.salaryMax) return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;
  if (job.salaryMin) return `From $${job.salaryMin.toLocaleString()}`;
  return "Salary undisclosed";
};

export default function SavedJobsClient({ savedJobs = [] }) {
  const router = useRouter();
  const [jobs, setJobs] = useState(savedJobs);
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  function remove(job) {
    startTransition(async () => {
      const result = await removeSavedJob(getId(job));

      if (result.error) {
        setFeedback(result.error);
        return;
      }

      setJobs((current) => current.filter((item) => getId(item) !== getId(job)));
      setFeedback("Saved job removed.");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-7">
      <PageHeader
        title="Saved Jobs"
        description="Keep track of interesting roles and return when you are ready to apply."
      />

      {feedback && (
        <p className="font-sans text-[13px] text-muted-foreground" role="status">
          {feedback}
        </p>
      )}

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center">
          <BookmarkX className="size-12 text-muted-foreground" />
          <h2 className="mt-4 font-heading text-[18px] font-semibold">
            No saved jobs yet
          </h2>
          <p className="mt-2 max-w-sm font-sans text-[14px] text-muted-foreground">
            Browse jobs and save roles you want to revisit.
          </p>
          <Link
            href="/jobs"
            className="mt-6 inline-flex h-10 items-center rounded-xl bg-primary px-5 font-sans text-[14px] font-medium text-primary-foreground"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <Table aria-label="Saved jobs">
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="pl-6">Job</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Saved</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={getId(job)} className="border-border hover:bg-popover">
                  <TableCell className="pl-6 py-3.5">
                    <Link
                      href={`/jobs/${getId(job)}`}
                      className="font-sans text-[14px] font-medium text-primary hover:underline"
                    >
                      {job.jobTitle}
                    </Link>
                    <p className="font-sans text-[12px] text-muted-foreground">
                      {job.jobType ?? "Job type unset"}
                    </p>
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
                    <span className="inline-flex items-center gap-1.5 font-sans text-[14px] text-muted-foreground">
                      <MapPin className="size-3.5" aria-hidden="true" />
                      {job.location}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="font-heading text-[14px] font-semibold text-primary">
                      {formatSalary(job)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="font-sans text-[14px] text-muted-foreground">
                      {formatDate(job.savedAt)}
                    </span>
                  </TableCell>
                  <TableCell className="pr-6 py-3.5">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/jobs/${getId(job)}`}
                        className="inline-flex h-8 items-center rounded-lg bg-primary px-3 font-sans text-[13px] font-medium text-primary-foreground"
                      >
                        Apply
                      </Link>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => remove(job)}
                        className={cn(
                          "inline-flex size-8 items-center justify-center rounded-lg border border-border",
                          "text-muted-foreground hover:border-destructive hover:text-destructive",
                          "disabled:cursor-not-allowed disabled:opacity-50",
                        )}
                        aria-label={`Remove ${job.jobTitle}`}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
