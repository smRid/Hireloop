"use server";

import { revalidatePath } from "next/cache";

import { serverMutation } from "@/lib/core/server";

const revalidateRecruiterJobs = () => {
  revalidatePath("/dashboard/recruiter");
  revalidatePath("/dashboard/recruiter/jobs");
  revalidatePath("/jobs");
};

export async function createJob(payload) {
  const result = await serverMutation("/jobs", payload);
  revalidateRecruiterJobs();
  return result;
}

export async function updateJob(jobId, payload) {
  const result = await serverMutation(`/jobs/${jobId}`, payload, "PATCH");
  revalidateRecruiterJobs();
  revalidatePath(`/dashboard/recruiter/jobs/${jobId}/applicants`);
  return result;
}

export async function deleteJob(jobId) {
  const result = await serverMutation(`/jobs/${jobId}`, undefined, "DELETE");
  revalidateRecruiterJobs();
  return result;
}
