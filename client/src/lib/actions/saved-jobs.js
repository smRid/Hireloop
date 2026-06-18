"use server";

import { revalidatePath } from "next/cache";

import { serverMutation } from "@/lib/core/server";

export async function saveJob(jobId) {
  const result = await serverMutation(`/saved-jobs/${jobId}`, {});
  revalidatePath("/dashboard/seeker/saved");
  revalidatePath("/dashboard/seeker");
  return result;
}

export async function removeSavedJob(jobId) {
  const result = await serverMutation(`/saved-jobs/${jobId}`, undefined, "DELETE");
  revalidatePath("/dashboard/seeker/saved");
  revalidatePath("/dashboard/seeker");
  return result;
}
