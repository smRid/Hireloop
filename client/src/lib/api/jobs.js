import { serverFetch } from "@/lib/core/server";
import { queryString } from "@/lib/core/query";

export const getJobs = (params = {}) => {
  return serverFetch(`/jobs${queryString(params)}`, { cache: "no-store" });
};

export const getFeaturedJobs = (limit = 6) => {
  return getJobs({ page: 1, perPage: limit, status: "active" });
};

export const getJobById = (jobId) => {
  return serverFetch(`/jobs/${jobId}`, { cache: "no-store" });
};

export const getSimilarJobs = (job, limit = 3) => {
  return getJobs({
    jobCategory: job?.jobCategory ?? job?.category,
    page: 1,
    perPage: limit + 1,
    status: "active",
  });
};
