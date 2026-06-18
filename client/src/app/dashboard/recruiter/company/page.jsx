import CompanyProfileClient from "@/components/dashboardPage/recruiter/CompanyProfileClient";
import { getCompaniesByRecruiterId } from "@/lib/api/companies";
import { requireRole } from "@/lib/core/session";

export default async function RecruiterCompanyPage() {
  const user = await requireRole("recruiter");
  const response = await getCompaniesByRecruiterId(user.id);
  const companies = Array.isArray(response.data) ? response.data : [];

  return (
    <CompanyProfileClient
      initialCompanies={companies}
      recruiterId={user.id}
    />
  );
}
