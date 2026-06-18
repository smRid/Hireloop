"use server";

import { serverMutation } from "@/lib/core/server";

export async function setRole(payload) {
  return serverMutation("/users/set-role", payload, "PATCH");
}

export async function updateUserRole(userId, role) {
  return setRole({ userId, role });
}
