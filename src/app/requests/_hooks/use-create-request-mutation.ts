import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createRequest } from "@/api/requests"

import { invalidateRequestCollections } from "../_utils/invalidate-request-queries"

export function useCreateRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      invalidateRequestCollections(queryClient)
    },
  })
}
