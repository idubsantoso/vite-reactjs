import { useQuery } from "@tanstack/react-query"

import { getRequests } from "@/api/requests"

import { requestsQueryKeys } from "../_constants/request-query-keys"

export function useRequestsQuery() {
  return useQuery({
    queryKey: requestsQueryKeys.lists(),
    queryFn: getRequests,
  })
}
