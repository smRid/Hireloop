import { queryString } from "@/lib/core/query";
import { serverFetch } from "@/lib/core/server";

export const getApplications = (params = {}) => {
  return serverFetch(`/applications${queryString(params)}`, {
    cache: "no-store",
  });
};
