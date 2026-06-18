import { serverFetch } from "@/lib/core/server";

export const getCompanies = () => {
  return serverFetch("/companies");
};

export const getCompaniesByRecruiterId = (recruiterId) => {
  return serverFetch(`/companies/${recruiterId}`);
};
