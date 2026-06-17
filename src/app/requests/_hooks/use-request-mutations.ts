import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  createRequest,
  deleteRequest,
  updateRequest,
} from "@/api/requests"
import { auditLogsQueryKeys } from "@/app/audit-logs/_hooks/use-audit-logs-query"
import type { MockRequest } from "@/mocks/data"
import type { RequestFormValues } from "@/app/requests/_schemas/request-schema"

import { requestsQueryKeys } from "./use-requests-query"

export function useCreateRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      invalidateRequestCollections(queryClient)
    },
  })
}

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

export function useDeleteRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRequest,
    onSuccess: () => {
      invalidateRequestCollections(queryClient)
    },
  })
}

function invalidateRequestQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  request: MockRequest,
) {
  invalidateRequestCollections(queryClient)
  void queryClient.invalidateQueries({
    queryKey: requestsQueryKeys.detail(request.id),
  })
}

function invalidateRequestCollections(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  void queryClient.invalidateQueries({ queryKey: requestsQueryKeys.all })
  void queryClient.invalidateQueries({ queryKey: auditLogsQueryKeys.all })
}
