"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { updateApplicationStatus } from "@/lib/actions/applications";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { label: "Applied", value: "applied" },
  { label: "Under Review", value: "under_review" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Rejected", value: "rejected" },
  { label: "Offered", value: "offered" },
];

const getId = (item) => item?._id ?? item?.id ?? "";

const titleForJob = (job) => job.jobTitle ?? job.title ?? "Untitled job";

const initialsForName = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatDate = (date) => {
  if (!date) return "Unknown";
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function Avatar({ name }) {
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full",
        "border border-border bg-popover",
        "font-heading text-[11px] font-semibold leading-none text-primary",
      )}
      aria-hidden="true"
    >
      {initialsForName(name)}
    </div>
  );
}

export default function ApplicantsClient({ initialApplications = [], job }) {
  const router = useRouter();
  const [applications, setApplications] = useState(initialApplications);
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  const counts = useMemo(() => {
    return applications.reduce(
      (result, application) => {
        result.total += 1;
        result[application.status] = (result[application.status] ?? 0) + 1;
        return result;
      },
      { total: 0 },
    );
  }, [applications]);

  function updateStatus(application, status) {
    const previous = application.status;

    setApplications((current) =>
      current.map((item) =>
        getId(item) === getId(application) ? { ...item, status } : item,
      ),
    );

    startTransition(async () => {
      const result = await updateApplicationStatus(
        getId(application),
        status,
        getId(job),
      );

      if (result.error) {
        setApplications((current) =>
          current.map((item) =>
            getId(item) === getId(application)
              ? { ...item, status: previous }
              : item,
          ),
        );
        setFeedback(result.error);
        return;
      }

      setFeedback("Applicant status updated.");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-7">
      <PageHeader
        title={`Applicants: ${titleForJob(job)}`}
        description={`${job.companyName ?? "Company"} - ${job.location ?? "Location flexible"}`}
        actions={
          <Link
            href="/dashboard/recruiter/jobs"
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4",
              "font-sans text-[14px] font-medium text-muted-foreground",
              "transition-colors hover:bg-popover hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Jobs
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardPanel>
          <p className="font-sans text-[13px] text-muted-foreground">Total</p>
          <p className="mt-2 font-heading text-[32px] font-bold text-primary">
            {counts.total}
          </p>
        </DashboardPanel>
        <DashboardPanel>
          <p className="font-sans text-[13px] text-muted-foreground">
            Shortlisted
          </p>
          <p className="mt-2 font-heading text-[32px] font-bold text-primary">
            {counts.shortlisted ?? 0}
          </p>
        </DashboardPanel>
        <DashboardPanel>
          <p className="font-sans text-[13px] text-muted-foreground">Offered</p>
          <p className="mt-2 font-heading text-[32px] font-bold text-primary">
            {counts.offered ?? 0}
          </p>
        </DashboardPanel>
      </div>

      {feedback && (
        <p className="font-sans text-[13px] text-muted-foreground" role="status">
          {feedback}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table aria-label={`Applicants for ${titleForJob(job)}`}>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="pl-6">Applicant</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 text-right">Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="py-16 text-center">
                  <p className="font-sans text-[14px] text-muted-foreground">
                    No applicants yet.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              applications.map((application) => (
                <TableRow
                  key={getId(application)}
                  className="border-border hover:bg-popover"
                >
                  <TableCell className="pl-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={application.applicantName} />
                      <div className="min-w-0">
                        <p className="truncate font-sans text-[14px] font-medium">
                          {application.applicantName}
                        </p>
                        <p className="truncate font-sans text-[12px] text-muted-foreground">
                          {application.applicantEmail}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="font-sans text-[14px] text-muted-foreground">
                      {formatDate(application.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    {application.resumeLink ? (
                      <a
                        href={application.resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-sans text-[14px] font-medium text-primary"
                      >
                        View
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="font-sans text-[14px] text-muted-foreground">
                        Not provided
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2">
                      <StatusPill status={application.status} />
                      <select
                        value={application.status}
                        disabled={isPending}
                        onChange={(event) =>
                          updateStatus(application, event.target.value)
                        }
                        className={cn(
                          "h-8 rounded-lg border border-border bg-popover px-2",
                          "font-sans text-[13px] text-foreground outline-none",
                          "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
                        )}
                        aria-label={`Status for ${application.applicantName}`}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </TableCell>
                  <TableCell className="pr-6 py-3.5">
                    <div className="flex justify-end">
                      <a
                        href={`mailto:${application.applicantEmail}`}
                        className={cn(
                          "inline-flex size-8 items-center justify-center rounded-lg",
                          "text-muted-foreground transition-colors hover:bg-popover hover:text-foreground",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        )}
                        aria-label={`Email ${application.applicantName}`}
                      >
                        <Mail className="size-4" aria-hidden="true" />
                      </a>
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
