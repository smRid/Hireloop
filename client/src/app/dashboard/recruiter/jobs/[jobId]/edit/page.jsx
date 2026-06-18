import { notFound } from "next/navigation";

import JobFormClient from "@/components/dashboardPage/recruiter/JobFormClient";
import { getCompaniesByRecruiterId } from "@/lib/api/companies";
import { getJobById } from "@/lib/api/jobs";
import { requireRole } from "@/lib/core/session";

const isApprovedCompany = (company) => {
  return ["approved", "verified"].includes(company.status);
};

const getParamId = async (params) => {
  const resolvedParams = await params;
  return resolvedParams.jobId;
};

const belongsToRecruiter = (job, user) => {
  return job?.recruiterId === user.id || job?.recruiterId === user._id;
};

export default async function EditRecruiterJobPage({ params }) {
  const user = await requireRole("recruiter");
  const jobId = await getParamId(params);
  const [jobResponse, companiesResponse] = await Promise.all([
    getJobById(jobId),
    getCompaniesByRecruiterId(user.id),
  ]);

  if (!jobResponse.data || !belongsToRecruiter(jobResponse.data, user)) {
    notFound();
  }

  const companies = Array.isArray(companiesResponse.data)
    ? companiesResponse.data
    : [];

  return (
    <JobFormClient
      approvedCompanies={companies.filter(isApprovedCompany)}
      initialJob={jobResponse.data}
      mode="edit"
      recruiterId={user.id}
    />
  );
}
