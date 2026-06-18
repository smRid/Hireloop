"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, CreditCard, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import DashboardPanel from "@/components/shared/DashboardPanel";
import PageHeader from "@/components/shared/PageHeader";
import StatusPill from "@/components/shared/StatusPill";
import { createSubscription, cancelSubscription } from "@/lib/actions/subscriptions";
import { cn } from "@/lib/utils";

const getId = (item) => item?._id ?? item?.id ?? "";

const money = (amount = 0, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(amount);

const formatDate = (date) => {
  if (!date) return "Not set";
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function SeekerBillingClient({
  payments = [],
  plans = [],
  subscriptions = [],
  user,
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const activeSubscription = useMemo(() => {
    return subscriptions.find((subscription) =>
      ["active", "trialing", "past_due"].includes(subscription.status),
    );
  }, [subscriptions]);
  const currentPlanId = activeSubscription?.planId ?? user?.plan ?? "free";

  function choosePlan(plan) {
    startTransition(async () => {
      const result = await createSubscription({
        amount: plan.price ?? 0,
        currency: plan.currency ?? "USD",
        email: user.email,
        planId: plan.planId,
        userId: user.id,
      });

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setMessage("Plan updated.");
      router.refresh();
    });
  }

  function cancelCurrent() {
    if (!activeSubscription) return;

    startTransition(async () => {
      const result = await cancelSubscription(getId(activeSubscription));

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setMessage("Subscription canceled.");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-7">
      <PageHeader
        title="Billing"
        description="Manage your plan, subscription status, and payment history."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-5 sm:grid-cols-2">
          {plans.map((plan) => {
            const isCurrent = plan.planId === currentPlanId;
            return (
              <DashboardPanel
                key={plan.planId}
                className={cn(
                  "flex flex-col gap-5",
                  isCurrent && "border-primary/40",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-[20px] font-semibold">
                      {plan.name}
                    </h2>
                    <p className="font-sans text-[13px] text-muted-foreground">
                      {plan.audience}
                    </p>
                  </div>
                  {isCurrent && <StatusPill status="active">Current</StatusPill>}
                </div>
                <p className="font-heading text-[34px] font-bold text-primary">
                  {plan.price ? money(plan.price, plan.currency) : "$0"}
                  <span className="ml-1 font-sans text-[13px] font-normal text-muted-foreground">
                    / {plan.interval ?? "month"}
                  </span>
                </p>
                <ul className="flex flex-1 flex-col gap-2">
                  {(plan.features ?? []).map((feature) => (
                    <li key={feature} className="flex gap-2 font-sans text-[14px] text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  disabled={isPending || isCurrent}
                  onClick={() => choosePlan(plan)}
                  className={cn(
                    "h-10 rounded-xl font-sans text-[14px] font-medium",
                    isCurrent
                      ? "border border-border text-muted-foreground"
                      : "bg-primary text-primary-foreground hover:bg-primary/90",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                  )}
                >
                  {isCurrent ? "Current Plan" : "Choose Plan"}
                </button>
              </DashboardPanel>
            );
          })}
        </div>

        <div className="flex flex-col gap-5">
          <DashboardPanel className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CreditCard className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-heading text-[18px] font-semibold">
                  Current Subscription
                </h2>
                <p className="font-sans text-[13px] text-muted-foreground">
                  {activeSubscription ? activeSubscription.planId : "No active subscription"}
                </p>
              </div>
            </div>
            {activeSubscription && (
              <>
                <StatusPill status={activeSubscription.status} />
                <p className="font-sans text-[14px] text-muted-foreground">
                  Renews {formatDate(activeSubscription.currentPeriodEnd)}
                </p>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={cancelCurrent}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-destructive/30 font-sans text-[14px] font-medium text-destructive hover:bg-destructive/10 disabled:opacity-60"
                >
                  <XCircle className="size-4" aria-hidden="true" />
                  Cancel
                </button>
              </>
            )}
          </DashboardPanel>

          <DashboardPanel>
            <h2 className="font-heading text-[18px] font-semibold">
              Payment History
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {payments.length === 0 ? (
                <li className="font-sans text-[14px] text-muted-foreground">
                  No payments yet.
                </li>
              ) : (
                payments.map((payment) => (
                  <li key={getId(payment)} className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-sans text-[14px] font-medium">
                        {payment.planId}
                      </p>
                      <p className="font-sans text-[12px] text-muted-foreground">
                        {formatDate(payment.createdAt)}
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
        </div>
      </div>

      {message && (
        <p className="font-sans text-[13px] text-muted-foreground" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
