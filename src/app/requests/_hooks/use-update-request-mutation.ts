import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateRequest } from "@/api/requests"
import type { RequestFormValues } from "@/app/requests/_schemas/request-schema"

import { invalidateRequestQueries } from "../_utils/invalidate-request-queries"

export function useUpdateRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: RequestFormValues }) =>
      updateRequest(id, values),
    onSuccess: (request) => {
      invalidateRequestQueries(queryClient, request)
    },
  })
}
