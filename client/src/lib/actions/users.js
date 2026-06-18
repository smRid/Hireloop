"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { serverMutation } from "@/lib/core/server";

export async function setRole(payload) {
  return serverMutation("/users/set-role", payload, "PATCH");
}

export async function updateUserRole(userId, role) {
  const data = await auth.api.setRole({
    body: {
      userId,
      role,
    },
    headers: await headers(),
  });

  revalidatePath("/dashboard/admin/users");

  return { data };
}

export async function updateUserAccountRole(userId, role) {
  revalidatePath("/dashboard/admin/users");
  return serverMutation(`/users/${userId}/role`, { role }, "PATCH");
}

export async function updateUserStatus(userId, status) {
  revalidatePath("/dashboard/admin/users");
  return serverMutation(`/users/${userId}/status`, { status }, "PATCH");
}
