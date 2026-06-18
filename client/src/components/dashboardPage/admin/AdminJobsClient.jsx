"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Search, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import CompanyLogo from "@/components/shared/CompanyLogo";
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

const getId = (item) => item?._id ?? item?.id ?? "";

export default function AdminJobsClient({ initialJobs = [] }) {
  const router = useRouter();
  const [jobs, setJobs] = useState(initialJobs);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesQuery =
        !normalized ||
        job.jobTitle?.toLowerCase().includes(normalized) ||
        job.companyName?.toLowerCase().includes(normalized);
      const matchesStatus = status === "all" || job.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [jobs, query, status]);

  function closeJob(job) {
    startTransition(async () => {
      const result = await updateJob(getId(job), { status: "closed" });

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setJobs((current) =>
        current.map((item) =>
          getId(item) === getId(job) ? { ...item, status: "closed" } : item,
        ),
      );
      setMessage("Job closed.");
      router.refresh();
    });
  }

  function removeJob(job) {
    startTransition(async () => {
      const result = await deleteJob(getId(job));

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setJobs((current) => current.filter((item) => getId(item) !== getId(job)));
      setMessage("Job deleted.");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-7">
      <PageHeader
        title="Manage Jobs"
        description="Moderate marketplace job posts across all recruiters."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-sans text-[14px] text-muted-foreground">
          Showing {filtered.length} of {jobs.length} jobs
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-80 items-center rounded-lg border border-border bg-popover px-3">
            <Search className="mr-2 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-full flex-1 bg-transparent font-sans text-[14px] outline-none"
              placeholder="Search jobs..."
              type="search"
            />
          </div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-10 rounded-lg border border-border bg-popover px-3 font-sans text-[14px] outline-none"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
            <option value="removed">Removed</option>
          </select>
        </div>
      </div>

      {message && (
        <p className="font-sans text-[13px] text-muted-foreground" role="status">
          {message}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table aria-label="Jobs">
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="pl-6">Role</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applicants</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-16 text-center">
                  <p className="font-sans text-[14px] text-muted-foreground">
                    No jobs match this filter.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((job) => (
                <TableRow key={getId(job)} className="border-border hover:bg-popover">
                  <TableCell className="pl-6 py-3.5">
                    <Link
                      href={`/jobs/${getId(job)}`}
                      className="font-sans text-[14px] font-medium text-primary hover:underline"
                    >
                      {job.jobTitle}
                    </Link>
                    <p className="font-sans text-[12px] text-muted-foreground">
                      {job.jobType} - {job.location}
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
                    <span className="font-sans text-[14px] text-muted-foreground">
                      {job.jobCategory}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <StatusPill status={job.status} />
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="font-heading text-[15px] font-semibold text-primary">
                      {job.applicantsCount ?? 0}
                    </span>
                  </TableCell>
                  <TableCell className="pr-6 py-3.5">
                    <div className="flex justify-end gap-1">
                      {job.status === "active" && (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => closeJob(job)}
                          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-popover"
                          aria-label={`Close ${job.jobTitle}`}
                        >
                          <XCircle className="size-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => removeJob(job)}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Delete ${job.jobTitle}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
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
