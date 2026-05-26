import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  createUser,
  updateUser,
  updateUserStatus,
} from "@/api/users"
import { AUTH_USER_ID_STORAGE_KEY } from "@/app/_constants/auth-storage"
import { currentUserQueryKey } from "@/app/login/_hooks/use-current-user-query"
import { auditLogsQueryKeys } from "@/app/audit-logs/_hooks/use-audit-logs-query"
import type { User } from "@/app/users/_constants/sample-users"
import type { UserFormValues } from "@/app/users/_schemas/user-schema"

import { usersQueryKeys } from "./use-users-query"

export function useCreateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: auditLogsQueryKeys.all })
    },
  })
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: UserFormValues }) =>
      updateUser(id, values),
    onSuccess: (user) => {
      invalidateUserQueries(queryClient, user)
    },
  })
}

export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: User["status"] }) =>
      updateUserStatus(id, status),
    onSuccess: (user) => {
      invalidateUserQueries(queryClient, user)
    },
  })
}

function invalidateUserQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  user: User,
) {
  void queryClient.invalidateQueries({ queryKey: usersQueryKeys.all })
  void queryClient.invalidateQueries({ queryKey: usersQueryKeys.detail(user.id) })
  void queryClient.invalidateQueries({ queryKey: auditLogsQueryKeys.all })

  if (localStorage.getItem(AUTH_USER_ID_STORAGE_KEY) === user.id) {
    void queryClient.invalidateQueries({ queryKey: currentUserQueryKey })
  }
}
