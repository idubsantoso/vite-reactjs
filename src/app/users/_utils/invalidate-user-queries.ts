import type { QueryClient } from "@tanstack/react-query"

import { AUTH_USER_ID_STORAGE_KEY } from "@/app/_constants/auth-storage"
import { auditLogsQueryKeys } from "@/app/audit-logs/_hooks/use-audit-logs-query"
import { currentUserQueryKey } from "@/app/login/_hooks/use-current-user-query"

import type { User } from "../_constants/sample-users"
import { usersQueryKeys } from "../_constants/user-query-keys"

export function invalidateUserCollections(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: usersQueryKeys.all })
  void queryClient.invalidateQueries({ queryKey: auditLogsQueryKeys.all })
}

export function invalidateUserQueries(queryClient: QueryClient, user: User) {
  invalidateUserCollections(queryClient)
  void queryClient.invalidateQueries({
    queryKey: usersQueryKeys.detail(user.id),
  })

  if (localStorage.getItem(AUTH_USER_ID_STORAGE_KEY) === user.id) {
    void queryClient.invalidateQueries({ queryKey: currentUserQueryKey })
  }
}
