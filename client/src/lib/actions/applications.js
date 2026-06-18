"use server";

import { revalidatePath } from "next/cache";

import { serverMutation } from "@/lib/core/server";

export async function updateApplicationStatus(applicationId, status, jobId) {
  const result = await serverMutation(
    `/applications/${applicationId}/status`,
    { status },
    "PATCH",
  );

  revalidatePath("/dashboard/recruiter");
  if (jobId) {
    revalidatePath(`/dashboard/recruiter/jobs/${jobId}/applicants`);
  }

  return result;
}
