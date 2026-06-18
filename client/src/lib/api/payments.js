import { queryString } from "@/lib/core/query";
import { serverFetch } from "@/lib/core/server";

export const getPayments = (params = {}) => {
  return serverFetch(`/payments${queryString(params)}`, {
    cache: "no-store",
  });
};
