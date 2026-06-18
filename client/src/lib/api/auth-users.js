import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export const getAuthUsers = async () => {
  return auth.api.listUsers({
    query: {
      sortBy: "createdAt",
      sortDirection: "desc",
    },
    headers: await headers(),
  });
};
