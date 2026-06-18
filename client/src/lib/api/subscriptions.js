import { queryString } from "@/lib/core/query";
import { serverFetch } from "@/lib/core/server";

export const getSubscriptions = (params = {}) => {
  return serverFetch(`/subscriptions${queryString(params)}`, {
    cache: "no-store",
  });
};
