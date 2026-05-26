import { useQuery } from "@tanstack/react-query"

import { getCurrentUser } from "@/api/auth"
import { AUTH_TOKEN_STORAGE_KEY } from "@/app/_constants/auth-storage"

export const currentUserQueryKey = ["current-user"] as const

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
    enabled: Boolean(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)),
  })
}
