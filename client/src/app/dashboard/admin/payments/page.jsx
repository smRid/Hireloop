import AdminPaymentsClient from "@/components/dashboardPage/admin/AdminPaymentsClient";
import { getPayments } from "@/lib/api/payments";
import { getSubscriptions } from "@/lib/api/subscriptions";
import { requireRole } from "@/lib/core/session";

export default async function AdminPaymentsPage() {
  await requireRole("admin");
  const [paymentsResponse, subscriptionsResponse] = await Promise.all([
    getPayments(),
    getSubscriptions(),
  ]);

  return (
    <AdminPaymentsClient
      initialPayments={
        Array.isArray(paymentsResponse.data) ? paymentsResponse.data : []
      }
      initialSubscriptions={
        Array.isArray(subscriptionsResponse.data) ? subscriptionsResponse.data : []
      }
    />
  );
}
