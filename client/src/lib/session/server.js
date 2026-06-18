import { headers } from "next/headers";
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
