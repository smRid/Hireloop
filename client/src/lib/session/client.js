import { useSession } from "@/lib/auth-client";

const useCurrentUser = () => {
  const { data: session, isPending, error } = useSession();

  return {
    user: session?.user ?? null,
    session,
    isLoading: isPending,
    error,
    isAuthenticated: !!session?.user,
  };
};

export default useCurrentUser;
