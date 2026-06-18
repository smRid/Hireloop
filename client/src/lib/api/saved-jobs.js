import { serverFetch } from "@/lib/core/server";

export const getSavedJobs = () => {
  return serverFetch("/saved-jobs", { cache: "no-store" });
};
