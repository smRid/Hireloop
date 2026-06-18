"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

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
import { updatePaymentStatus } from "@/lib/actions/payments";
import { cancelSubscription } from "@/lib/actions/subscriptions";

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

export default function AdminPaymentsClient({
  initialPayments = [],
  initialSubscriptions = [],
}) {
  const router = useRouter();
  const [payments, setPayments] = useState(initialPayments);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function setPaymentStatus(payment, status) {
    startTransition(async () => {
      const result = await updatePaymentStatus(getId(payment), status);

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setPayments((current) =>
        current.map((item) =>
          getId(item) === getId(payment) ? { ...item, status } : item,
        ),
      );
      setMessage("Payment status updated.");
      router.refresh();
    });
  }

  function cancel(subscription) {
    startTransition(async () => {
      const result = await cancelSubscription(getId(subscription));

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setSubscriptions((current) =>
        current.map((item) =>
          getId(item) === getId(subscription)
            ? { ...item, status: "canceled" }
            : item,
        ),
      );
      setMessage("Subscription canceled.");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-7">
      <PageHeader
        title="Subscriptions & Payments"
        description="Review active subscriptions, payment attempts, and billing statuses."
      />

      {message && (
        <p className="font-sans text-[13px] text-muted-foreground" role="status">
          {message}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table aria-label="Subscriptions">
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="pl-6">User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Period End</TableHead>
              <TableHead className="pr-6 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                  No subscriptions yet.
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((subscription) => (
                <TableRow key={getId(subscription)} className="border-border hover:bg-popover">
                  <TableCell className="pl-6 py-3.5">
                    <p className="font-sans text-[14px] font-medium">
                      {subscription.email}
                    </p>
                    <p className="font-sans text-[12px] text-muted-foreground">
                      {subscription.userId}
                    </p>
                  </TableCell>
                  <TableCell className="py-3.5">{subscription.planId}</TableCell>
                  <TableCell className="py-3.5">
                    <StatusPill status={subscription.status} />
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="font-sans text-[14px] text-muted-foreground">
                      {formatDate(subscription.currentPeriodEnd)}
                    </span>
                  </TableCell>
                  <TableCell className="pr-6 py-3.5 text-right">
                    {subscription.status !== "canceled" && (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => cancel(subscription)}
                        className="font-sans text-[13px] font-medium text-destructive disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table aria-label="Payments">
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="pl-6">Payer</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="pr-6 text-right">Mark</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  No payments yet.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={getId(payment)} className="border-border hover:bg-popover">
                  <TableCell className="pl-6 py-3.5">
                    <p className="font-sans text-[14px] font-medium">
                      {payment.email}
                    </p>
                    <p className="font-sans text-[12px] text-muted-foreground">
                      {payment.userId}
                    </p>
                  </TableCell>
                  <TableCell className="py-3.5">{payment.planId}</TableCell>
                  <TableCell className="py-3.5">
                    <span className="font-heading text-[15px] font-semibold text-primary">
                      {money(payment.amount, payment.currency)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <StatusPill status={payment.status} />
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="font-sans text-[14px] text-muted-foreground">
                      {formatDate(payment.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="pr-6 py-3.5">
                    <div className="flex justify-end gap-2">
                      {["paid", "failed", "refunded"].map((status) => (
                        <button
                          key={status}
                          type="button"
                          disabled={isPending || payment.status === status}
                          onClick={() => setPaymentStatus(payment, status)}
                          className="font-sans text-[12px] font-medium text-primary disabled:text-muted-foreground"
                        >
                          {status}
                        </button>
                      ))}
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
