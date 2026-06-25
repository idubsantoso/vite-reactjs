import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateUser } from "@/api/users"
import type { UserFormValues } from "@/app/users/_schemas/user-schema"

import { invalidateUserQueries } from "../_utils/invalidate-user-queries"

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
