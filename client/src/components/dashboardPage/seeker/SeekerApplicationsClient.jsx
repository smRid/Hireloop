"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";

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
import { cn } from "@/lib/utils";

const STATUSES = ["all", "applied", "under_review", "shortlisted", "offered", "rejected"];

const getId = (item) => item?._id ?? item?.id ?? "";

const formatDate = (date) => {
  if (!date) return "Unknown";
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const statusLabel = (status) => {
  if (status === "all") return "All";
  return status
    .split("_")
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(" ");
};

export default function SeekerApplicationsClient({ applications = [] }) {
  const [status, setStatus] = useState("all");
  const filtered = useMemo(() => {
    if (status === "all") return applications;
    return applications.filter((application) => application.status === status);
  }, [applications, status]);

  const counts = useMemo(() => {
    return applications.reduce(
      (result, application) => {
        result.all += 1;
        result[application.status] = (result[application.status] ?? 0) + 1;
        return result;
      },
      { all: 0 },
    );
  }, [applications]);

  return (
    <div className="flex flex-col gap-7">
      <PageHeader
        title="My Applications"
        description="Track every role you have applied to and follow recruiter decisions."
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUSES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(item)}
            aria-pressed={status === item}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5",
              "font-sans text-[13px] font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              status === item
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-popover text-muted-foreground hover:text-foreground",
            )}
          >
            {statusLabel(item)}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none",
                status === item
                  ? "bg-primary-foreground/20"
                  : "bg-border text-muted-foreground",
              )}
            >
              {counts[item] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table aria-label="My job applications">
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="pl-6">Role</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Briefcase className="size-10 text-muted-foreground" />
                    <p className="font-sans text-[14px] text-muted-foreground">
                      {status === "all"
                        ? "No applications yet."
                        : "No applications match this status."}
                    </p>
                    {status === "all" && (
                      <Link
                        href="/jobs"
                        className="font-sans text-[14px] font-medium text-primary"
                      >
                        Browse jobs
                      </Link>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((application) => (
                <TableRow
                  key={getId(application)}
                  className="border-border hover:bg-popover"
                >
                  <TableCell className="pl-6 py-3.5">
                    <Link
                      href={`/jobs/${application.jobId}`}
                      className="font-sans text-[14px] font-medium text-primary hover:underline"
                    >
                      {application.jobTitle}
                    </Link>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2">
                      <CompanyLogo name={application.companyName} size="sm" />
                      <span className="font-sans text-[14px] text-muted-foreground">
                        {application.companyName ?? "Company"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="font-sans text-[14px] text-muted-foreground">
                      {formatDate(application.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <StatusPill status={application.status} />
                  </TableCell>
                  <TableCell className="pr-6 py-3.5">
                    <div className="flex justify-end">
                      <Link
                        href={`/jobs/${application.jobId}`}
                        className="inline-flex items-center gap-1 font-sans text-[13px] font-medium text-primary"
                      >
                        View
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
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
