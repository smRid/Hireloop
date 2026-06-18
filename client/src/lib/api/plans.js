import { serverFetch } from "@/lib/core/server";

const queryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, String(value));
  });

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
};

export const getPlans = (params = {}) => {
  return serverFetch(`/plans${queryString(params)}`, { cache: "no-store" });
};

export const getPlanById = (planId) => {
  return serverFetch(`/plans/${planId}`, { cache: "no-store" });
};
