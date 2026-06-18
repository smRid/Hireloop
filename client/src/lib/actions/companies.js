"use server";

import { revalidatePath } from "next/cache";

import { serverMutation } from "@/lib/core/server";

export async function registerCompany(payload) {
  const result = await serverMutation("/companies", payload);
  revalidatePath("/dashboard/recruiter/company");
  revalidatePath("/companies");
  return result;
}

export async function createCompany(payload) {
  return registerCompany(payload);
}

export async function updateCompany(companyId, payload) {
  const result = await serverMutation(`/companies/${companyId}`, payload, "PATCH");
  revalidatePath("/dashboard/recruiter/company");
  revalidatePath("/companies");
  return result;
}
