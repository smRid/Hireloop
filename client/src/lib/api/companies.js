import { serverFetch } from "@/lib/core/server";

export const getCompanies = () => {
  return serverFetch("/companies", { cache: "no-store" });
};

export const getCompaniesByRecruiterId = (recruiterId) => {
  return serverFetch(`/companies/recruiter/${recruiterId}`, { cache: "no-store" });
};
