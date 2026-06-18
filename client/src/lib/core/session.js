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

const normalizeRole = (role) => {
  return role === "user" ? "seeker" : role;
};

export const requireUser = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.status === "suspended") {
    redirect("/forbidden");
  }

  return user;
};

export const requireRole = async (roles) => {
  const user = await requireUser();
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const role = normalizeRole(user.role);

  if (!role) {
    redirect("/onboarding");
  }

  if (!allowedRoles.includes(role)) {
    redirect("/forbidden");
  }

  return { ...user, role };
};
