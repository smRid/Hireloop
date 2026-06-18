import BrowseJobsClient from "@/components/jobs/BrowseJobsClient";
import { getJobs } from "@/lib/api/jobs";
import { normalizeJob } from "@/lib/marketplace/normalizers";

export const metadata = {
  title: "Browse Jobs",
};

export default async function BrowseJobsPage() {
  const response = await getJobs({
    page: 1,
    perPage: 100,
    status: "active",
  });
  const payload = response.data ?? {};
  const rawJobs = Array.isArray(payload) ? payload : payload.jobs ?? [];
  const jobs = rawJobs.map(normalizeJob);
  const total = payload.total ?? jobs.length;

  return <BrowseJobsClient jobs={jobs} total={total} />;
}
