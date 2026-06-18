import AdminOverview from "@/components/dashboardPage/admin/AdminOverview";
import { getCompanies } from "@/lib/api/companies";
import { getJobs } from "@/lib/api/jobs";
import { getPayments } from "@/lib/api/payments";
import { getSubscriptions } from "@/lib/api/subscriptions";
import { getUsers } from "@/lib/api/users";
import { requireRole } from "@/lib/core/session";

const jobsFromResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  return Array.isArray(payload?.jobs) ? payload.jobs : [];
};

export default async function AdminDashboardPage() {
  await requireRole("admin");
  const [usersResponse, companiesResponse, jobsResponse, paymentsResponse, subscriptionsResponse] =
    await Promise.all([
      getUsers(),
      getCompanies(),
      getJobs({ page: 1, perPage: 100 }),
      getPayments(),
      getSubscriptions(),
    ]);

  return (
    <AdminOverview
      companies={Array.isArray(companiesResponse.data) ? companiesResponse.data : []}
      jobs={jobsFromResponse(jobsResponse.data)}
      payments={Array.isArray(paymentsResponse.data) ? paymentsResponse.data : []}
      subscriptions={
        Array.isArray(subscriptionsResponse.data) ? subscriptionsResponse.data : []
      }
      users={Array.isArray(usersResponse.data) ? usersResponse.data : []}
    />
  );
}
