"use server";

import { revalidatePath } from "next/cache";

import { serverMutation } from "@/lib/core/server";

export async function updatePaymentStatus(paymentId, status) {
  const result = await serverMutation(
    `/payments/${paymentId}/status`,
    { status },
    "PATCH",
  );
  revalidatePath("/dashboard/admin/payments");
  revalidatePath("/dashboard/admin");
  return result;
}
