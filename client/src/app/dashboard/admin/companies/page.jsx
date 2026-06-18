import AdminCompaniesClient from "@/components/dashboardPage/admin/AdminCompaniesClient";
import { getCompanies } from "@/lib/api/companies";
import { requireRole } from "@/lib/core/session";

export default async function AdminCompaniesPage() {
  await requireRole("admin");
  const response = await getCompanies();
  const companies = Array.isArray(response.data) ? response.data : [];

  return <AdminCompaniesClient initialCompanies={companies} />;
}
