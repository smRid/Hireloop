import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export const getCurrentSession = async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
};

export const getCurrentUser = async () => {
  const session = await getCurrentSession();
  return session?.user ?? null;
};

export const requireUser = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/unauthorized");
  }

  return user;
};

export const requireRole = async (roles) => {
  const user = await requireUser();
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!allowedRoles.includes(user.role)) {
    redirect("/forbidden");
  }

  return user;
};
