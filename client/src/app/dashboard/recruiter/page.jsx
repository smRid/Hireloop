import RecruiterOverview from "@/components/dashboardPage/recruiter/RecruiterOverview";
import { getApplications } from "@/lib/api/applications";
import { getCompaniesByRecruiterId } from "@/lib/api/companies";
import { getJobs } from "@/lib/api/jobs";
import { requireRole } from "@/lib/core/session";

const jobsFromResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  return Array.isArray(payload?.jobs) ? payload.jobs : [];
};

export default async function RecruiterDashboardPage() {
  const user = await requireRole("recruiter");
  const [jobsResponse, companiesResponse, applicationsResponse] =
    await Promise.all([
      getJobs({ page: 1, perPage: 100, recruiterId: user.id }),
      getCompaniesByRecruiterId(user.id),
      getApplications(),
    ]);

  return (
    <RecruiterOverview
      applications={
        Array.isArray(applicationsResponse.data) ? applicationsResponse.data : []
      }
      companies={Array.isArray(companiesResponse.data) ? companiesResponse.data : []}
      jobs={jobsFromResponse(jobsResponse.data)}
      recruiterName={user.name?.split(" ")[0] ?? "there"}
    />
  );
}
