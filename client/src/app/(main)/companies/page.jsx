import { getCompanies } from "@/lib/api/companies";
import { getJobs } from "@/lib/api/jobs";
import {
  normalizeCompany,
  normalizeJob,
} from "@/lib/marketplace/normalizers";

import CompaniesClient from "./CompaniesClient";

export const metadata = {
  title: "Companies",
};

export default async function CompaniesPage() {
  const [companiesResponse, jobsResponse] = await Promise.all([
    getCompanies(),
    getJobs({ page: 1, perPage: 100, status: "active" }),
  ]);

  const jobsPayload = jobsResponse.data ?? {};
  const rawJobs = Array.isArray(jobsPayload) ? jobsPayload : jobsPayload.jobs ?? [];
  const jobs = rawJobs.map(normalizeJob);
  const companies = (companiesResponse.data ?? [])
    .filter((company) => ["approved", "verified"].includes(company.status))
    .map((company) => normalizeCompany(company, jobs));

  return <CompaniesClient companies={companies} />;
}
