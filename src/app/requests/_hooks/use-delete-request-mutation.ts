import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteRequest } from "@/api/requests"

import { invalidateRequestCollections } from "../_utils/invalidate-request-queries"

export function useDeleteRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRequest,
    onSuccess: () => {
      invalidateRequestCollections(queryClient)
    },
  })
}
