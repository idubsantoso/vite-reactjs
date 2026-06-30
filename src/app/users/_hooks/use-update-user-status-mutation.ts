import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateUserStatus } from "@/api/users"
import type { User } from "@/app/users/_constants/sample-users"

import { invalidateUserQueries } from "../_utils/invalidate-user-queries"

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
