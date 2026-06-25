import type { QueryClient } from "@tanstack/react-query"

import { auditLogsQueryKeys } from "@/app/audit-logs/_hooks/use-audit-logs-query"
import type { MockRequest } from "@/mocks/data"

import { requestsQueryKeys } from "../_constants/request-query-keys"

export function invalidateRequestCollections(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: requestsQueryKeys.all })
  void queryClient.invalidateQueries({ queryKey: auditLogsQueryKeys.all })
}

export function invalidateRequestQueries(
  queryClient: QueryClient,
  request: MockRequest,
) {
  invalidateRequestCollections(queryClient)
  void queryClient.invalidateQueries({
    queryKey: requestsQueryKeys.detail(request.id),
  })
}
