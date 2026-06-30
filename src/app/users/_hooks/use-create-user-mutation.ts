import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createUser } from "@/api/users"

import { invalidateUserCollections } from "../_utils/invalidate-user-queries"

export function useCreateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      invalidateUserCollections(queryClient)
    },
  })
}
