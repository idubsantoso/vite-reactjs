import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateRequestStatus } from "@/api/requests"
import { auditLogsQueryKeys } from "@/app/audit-logs/_hooks/use-audit-logs-query"
import type { MockRequest } from "@/mocks/data"

import { requestsQueryKeys } from "./use-requests-query"

export function useUpdateRequestStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: MockRequest["status"]
    }) => updateRequestStatus(id, status),
    onSuccess: (request) => {
      void queryClient.invalidateQueries({ queryKey: requestsQueryKeys.all })
      void queryClient.invalidateQueries({
        queryKey: requestsQueryKeys.detail(request.id),
      })
      void queryClient.invalidateQueries({ queryKey: auditLogsQueryKeys.all })
    },
  })
}
