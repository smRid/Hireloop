import AdminJobsClient from "@/components/dashboardPage/admin/AdminJobsClient";
import { getJobs } from "@/lib/api/jobs";
import { requireRole } from "@/lib/core/session";

const jobsFromResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  return Array.isArray(payload?.jobs) ? payload.jobs : [];
};

export default async function AdminJobsPage() {
  await requireRole("admin");
  const response = await getJobs({ page: 1, perPage: 100 });

  return <AdminJobsClient initialJobs={jobsFromResponse(response.data)} />;
}
