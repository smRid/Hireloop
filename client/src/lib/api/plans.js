import { serverFetch } from "@/lib/core/server";
import { queryString } from "@/lib/core/query";

export const getPlans = (params = {}) => {
  return serverFetch(`/plans${queryString(params)}`, { cache: "no-store" });
};

export const getPlanById = (planId) => {
  return serverFetch(`/plans/${planId}`, { cache: "no-store" });
};
