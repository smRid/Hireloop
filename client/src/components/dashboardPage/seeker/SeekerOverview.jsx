import Link from "next/link";
import { Bookmark, Briefcase, CreditCard, FileText } from "lucide-react";

import DashboardPanel from "@/components/shared/DashboardPanel";
import StatusPill from "@/components/shared/StatusPill";

const countByStatus = (applications, status) =>
  applications.filter((application) => application.status === status).length;

function Stat({ icon: Icon, label, value }) {
  return (
    <DashboardPanel className="flex flex-col gap-4">
      <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-heading text-[32px] font-bold text-primary">{value}</p>
        <p className="font-sans text-[14px] text-muted-foreground">{label}</p>
      </div>
    </DashboardPanel>
  );
}

export default function SeekerOverview({
  applications = [],
  payments = [],
  savedJobs = [],
  subscriptions = [],
  user,
}) {
  const activeSubscription = subscriptions.find((subscription) =>
    ["active", "trialing", "past_due"].includes(subscription.status),
  );
  const recentApplications = applications.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-[28px] font-bold leading-tight text-primary">
          Welcome back, {user.name?.split(" ")[0] ?? "there"}
        </h1>
        <p className="font-sans text-[14px] text-muted-foreground">
          Keep moving through your job search from one focused view.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <Stat icon={Bookmark} label="Saved Jobs" value={savedJobs.length} />
        <Stat icon={FileText} label="Applications" value={applications.length} />
        <Stat
          icon={Briefcase}
          label="Shortlisted"
          value={countByStatus(applications, "shortlisted")}
        />
        <Stat icon={CreditCard} label="Payments" value={payments.length} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <DashboardPanel>
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-[18px] font-semibold">
              Recent Applications
            </h2>
            <Link
              href="/dashboard/seeker/applications"
              className="font-sans text-[13px] font-medium text-primary"
            >
              View all
            </Link>
          </div>
          <ul className="mt-4 flex flex-col gap-3">
            {recentApplications.length === 0 ? (
              <li className="rounded-xl border border-border bg-popover p-4 font-sans text-[14px] text-muted-foreground">
                No applications yet.
              </li>
            ) : (
              recentApplications.map((application) => (
                <li
                  key={application._id ?? application.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-popover p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-sans text-[14px] font-medium">
                      {application.jobTitle}
                    </p>
                    <p className="truncate font-sans text-[12px] text-muted-foreground">
                      {application.companyName}
                    </p>
                  </div>
                  <StatusPill status={application.status} />
                </li>
              ))
            )}
          </ul>
        </DashboardPanel>

        <DashboardPanel className="h-fit">
          <h2 className="font-heading text-[18px] font-semibold">Plan</h2>
          <p className="mt-4 font-heading text-[28px] font-bold text-primary">
            {activeSubscription?.planId ?? user.plan ?? "free"}
          </p>
          <p className="mt-1 font-sans text-[14px] text-muted-foreground">
            {activeSubscription
              ? `Status: ${activeSubscription.status}`
              : "No active paid subscription"}
          </p>
          <Link
            href="/dashboard/seeker/billing"
            className="mt-5 inline-flex h-9 items-center rounded-lg border border-border px-4 font-sans text-[14px] font-medium text-muted-foreground hover:bg-popover"
          >
            Manage billing
          </Link>
        </DashboardPanel>
      </div>
    </div>
  );
}
