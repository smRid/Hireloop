import { notFound } from "next/navigation";

import ApplicantsClient from "@/components/dashboardPage/recruiter/ApplicantsClient";
import { getApplications } from "@/lib/api/applications";
import { getJobById } from "@/lib/api/jobs";
import { requireRole } from "@/lib/core/session";

const getParamId = async (params) => {
  const resolvedParams = await params;
  return resolvedParams.jobId;
};

const belongsToRecruiter = (job, user) => {
  return job?.recruiterId === user.id || job?.recruiterId === user._id;
};

export default async function RecruiterApplicantsPage({ params }) {
  const user = await requireRole("recruiter");
  const jobId = await getParamId(params);
  const [jobResponse, applicationsResponse] = await Promise.all([
    getJobById(jobId),
    getApplications({ jobId }),
  ]);

  if (!jobResponse.data || !belongsToRecruiter(jobResponse.data, user)) {
    notFound();
  }

  const applications = Array.isArray(applicationsResponse.data)
    ? applicationsResponse.data
    : [];

  return (
    <ApplicantsClient
      initialApplications={applications}
      job={jobResponse.data}
    />
  );
}
