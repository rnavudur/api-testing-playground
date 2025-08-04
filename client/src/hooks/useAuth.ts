import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/user");
        if (!response.ok) {
          if (response.status === 401) {
            return null;
          }
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      } catch (err: any) {
        if (err.message?.includes("401") || err.message?.includes("Unauthorized")) {
          return null;
        }
        throw err;
      }
    },
    retry: false,
    staleTime: 0, // Always refetch to ensure fresh auth state
    gcTime: 0,    // Don't cache auth state
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}