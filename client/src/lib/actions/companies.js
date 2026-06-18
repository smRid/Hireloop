"use server";

import { serverMutation } from "@/lib/core/server";

export async function registerCompany(payload) {
  return serverMutation("/companies", payload);
}

export async function createCompany(payload) {
  return registerCompany(payload);
}
