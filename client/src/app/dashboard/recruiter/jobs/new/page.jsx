import JobFormClient from "@/components/dashboardPage/recruiter/JobFormClient";
import { getCompaniesByRecruiterId } from "@/lib/api/companies";
import { requireRole } from "@/lib/core/session";

const isApprovedCompany = (company) => {
  return ["approved", "verified"].includes(company.status);
};

export default async function NewRecruiterJobPage() {
  const user = await requireRole("recruiter");
  const response = await getCompaniesByRecruiterId(user.id);
  const companies = Array.isArray(response.data) ? response.data : [];

  return (
    <JobFormClient
      approvedCompanies={companies.filter(isApprovedCompany)}
      recruiterId={user.id}
    />
  );
}
