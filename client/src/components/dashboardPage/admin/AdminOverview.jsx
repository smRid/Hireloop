import Link from "next/link";
import { Briefcase, Building2, CreditCard, DollarSign, Users } from "lucide-react";

import DashboardPanel from "@/components/shared/DashboardPanel";
import StatusPill from "@/components/shared/StatusPill";

const money = (amount = 0, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(amount);

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

export default function AdminOverview({
  companies = [],
  jobs = [],
  payments = [],
  subscriptions = [],
  users = [],
}) {
  const revenue = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
  const recruiters = users.filter((user) => user.role === "recruiter").length;
  const recentPayments = payments.slice(0, 6);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-[28px] font-bold leading-tight text-primary">
          Admin Overview
        </h1>
        <p className="font-sans text-[14px] text-muted-foreground">
          Platform operations, moderation, and billing at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-5">
        <Stat icon={Users} label="Users" value={users.length} />
        <Stat icon={Users} label="Recruiters" value={recruiters} />
        <Stat icon={Building2} label="Companies" value={companies.length} />
        <Stat icon={Briefcase} label="Jobs" value={jobs.length} />
        <Stat icon={DollarSign} label="Revenue" value={money(revenue)} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <DashboardPanel>
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-[18px] font-semibold">
              Recent Payments
            </h2>
            <Link
              href="/dashboard/admin/payments"
              className="font-sans text-[13px] font-medium text-primary"
            >
              View all
            </Link>
          </div>
          <ul className="mt-4 flex flex-col gap-3">
            {recentPayments.length === 0 ? (
              <li className="font-sans text-[14px] text-muted-foreground">
                No payments yet.
              </li>
            ) : (
              recentPayments.map((payment) => (
                <li
                  key={payment._id ?? payment.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-popover p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-sans text-[14px] font-medium">
                      {payment.email}
                    </p>
                    <p className="font-sans text-[12px] text-muted-foreground">
                      {payment.planId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-[15px] font-semibold text-primary">
                      {money(payment.amount, payment.currency)}
                    </p>
                    <StatusPill status={payment.status} />
                  </div>
                </li>
              ))
            )}
          </ul>
        </DashboardPanel>

        <DashboardPanel>
          <h2 className="font-heading text-[18px] font-semibold">
            Subscriptions
          </h2>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CreditCard className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-heading text-[28px] font-bold text-primary">
                {
                  subscriptions.filter((subscription) =>
                    ["active", "trialing", "past_due"].includes(subscription.status),
                  ).length
                }
              </p>
              <p className="font-sans text-[14px] text-muted-foreground">
                Active subscriptions
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/admin/payments"
            className="mt-5 inline-flex h-9 items-center rounded-lg border border-border px-4 font-sans text-[14px] font-medium text-muted-foreground hover:bg-popover"
          >
            Manage billing
          </Link>
        </DashboardPanel>
      </div>
    </div>
  );
}
