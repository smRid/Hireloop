import Link from "next/link";
import { ArrowRight, Briefcase, Building2, CheckCircle2, Users } from "lucide-react";

import CompanyLogo from "@/components/shared/CompanyLogo";
import DashboardPanel from "@/components/shared/DashboardPanel";
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

const getId = (item) => item?._id ?? item?.id ?? "";

const statIcon = {
  activeJobs: CheckCircle2,
  applications: Users,
  companies: Building2,
  jobs: Briefcase,
};

const formatDate = (date) => {
  if (!date) return "Unknown";
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
};

function StatCard({ icon, label, value }) {
  const Icon = statIcon[icon];

  return (
    <DashboardPanel className="flex flex-col gap-4">
      <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-heading text-[32px] font-bold leading-none text-primary">
          {value}
        </p>
        <p className="mt-1 font-sans text-[14px] text-muted-foreground">
          {label}
        </p>
      </div>
    </DashboardPanel>
  );
}

function PanelHeader({ title, href }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="font-heading text-[18px] font-semibold">{title}</h2>
      <Link
        href={href}
        className={cn(
          "inline-flex items-center gap-1 font-sans text-[13px] font-medium text-primary",
          "hover:text-primary/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        View all
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function RecruiterOverview({
  applications = [],
  companies = [],
  jobs = [],
  recruiterName = "there",
}) {
  const activeJobs = jobs.filter((job) => job.status === "active").length;
  const approvedCompanies = companies.filter((company) =>
    ["approved", "verified"].includes(company.status),
  ).length;
  const recentApplications = applications.slice(0, 6);
  const topCompanies = companies.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-bold leading-tight text-primary">
          Welcome back, {recruiterName}
        </h1>
        <p className="font-sans text-[14px] text-muted-foreground">
          Here is what is happening across your hiring pipeline.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard icon="jobs" label="Total Jobs" value={jobs.length} />
        <StatCard
          icon="applications"
          label="Total Applicants"
          value={applications.length}
        />
        <StatCard icon="activeJobs" label="Active Jobs" value={activeJobs} />
        <StatCard
          icon="companies"
          label="Approved Companies"
          value={approvedCompanies}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
        <DashboardPanel className="min-w-0">
          <PanelHeader
            title="Recent Applications"
            href="/dashboard/recruiter/jobs"
          />
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <Table aria-label="Recent applications">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">Candidate</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="pr-4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplications.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="py-10 text-center">
                      <p className="font-sans text-[14px] text-muted-foreground">
                        Applications will appear here once candidates apply.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentApplications.map((application) => (
                    <TableRow key={getId(application)} className="hover:bg-popover">
                      <TableCell className="pl-4 py-3">
                        <p className="font-sans text-[14px] font-medium">
                          {application.applicantName}
                        </p>
                        <p className="font-sans text-[12px] text-muted-foreground">
                          {application.applicantEmail}
                        </p>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="font-sans text-[13px] text-muted-foreground">
                          {application.jobTitle}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="font-sans text-[13px] text-muted-foreground">
                          {formatDate(application.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="pr-4 py-3">
                        <StatusPill status={application.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DashboardPanel>

        <DashboardPanel>
          <PanelHeader
            title="Company Profiles"
            href="/dashboard/recruiter/company"
          />
          <ul className="mt-4 flex flex-col gap-3">
            {topCompanies.length === 0 ? (
              <li className="rounded-xl border border-border bg-popover p-4">
                <p className="font-sans text-[14px] text-muted-foreground">
                  Add a company profile to start posting roles.
                </p>
              </li>
            ) : (
              topCompanies.map((company) => (
                <li key={getId(company)}>
                  <Link
                    href="/dashboard/recruiter/company"
                    className="flex items-center gap-3 rounded-xl p-2 hover:bg-popover"
                  >
                    <CompanyLogo
                      name={company.name}
                      src={company.logoUrl}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-sans text-[14px] font-medium">
                        {company.name}
                      </p>
                      <p className="truncate font-sans text-[12px] text-muted-foreground">
                        {company.industry}
                      </p>
                    </div>
                    <StatusPill status={company.status} />
                  </Link>
                </li>
              ))
            )}
          </ul>
        </DashboardPanel>
      </div>
    </div>
  );
}
