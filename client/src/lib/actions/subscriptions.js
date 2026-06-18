"use server";

import { revalidatePath } from "next/cache";

import { serverMutation } from "@/lib/core/server";

export async function createSubscription(payload) {
  const result = await serverMutation("/subscriptions", payload);
  revalidatePath("/dashboard/seeker/billing");
  revalidatePath("/dashboard/recruiter/billing");
  revalidatePath("/dashboard/admin/payments");
  return result;
}

export async function cancelSubscription(subscriptionId) {
  const result = await serverMutation(
    `/subscriptions/${subscriptionId}/cancel`,
    {},
    "PATCH",
  );
  revalidatePath("/dashboard/seeker/billing");
  revalidatePath("/dashboard/recruiter/billing");
  revalidatePath("/dashboard/admin/payments");
  return result;
}
