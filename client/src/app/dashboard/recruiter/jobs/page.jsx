import RecruiterJobsClient from "@/components/dashboardPage/recruiter/RecruiterJobsClient";
import { getJobs } from "@/lib/api/jobs";
import { requireRole } from "@/lib/core/session";

const PLAN_LIMITS = {
  enterprise: 100,
  free: 1,
  growth: 25,
  premium: 20,
  pro: 10,
};

const jobsFromResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  return Array.isArray(payload?.jobs) ? payload.jobs : [];
};

export default async function RecruiterJobsPage() {
  const user = await requireRole("recruiter");
  const response = await getJobs({
    page: 1,
    perPage: 100,
    recruiterId: user.id,
  });

  return (
    <RecruiterJobsClient
      initialJobs={jobsFromResponse(response.data)}
      planLimit={PLAN_LIMITS[user.plan] ?? PLAN_LIMITS.free}
    />
  );
}
