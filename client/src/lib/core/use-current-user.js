"use client";

import { useSession } from "@/lib/auth-client";

const useCurrentUser = () => {
  const { data: session, isPending, error } = useSession();

  return {
    user: session?.user ?? null,
    session,
    isLoading: isPending,
    error,
    isAuthenticated: Boolean(session?.user),
  };
};

export default useCurrentUser;
