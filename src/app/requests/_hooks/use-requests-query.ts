import { useQuery } from "@tanstack/react-query"

import { getRequest, getRequests } from "@/api/requests"

export const requestsQueryKeys = {
  all: ["requests"] as const,
  lists: () => [...requestsQueryKeys.all, "list"] as const,
  details: () => [...requestsQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...requestsQueryKeys.details(), id] as const,
}

export function useRequestsQuery() {
  return useQuery({
    queryKey: requestsQueryKeys.lists(),
    queryFn: getRequests,
  })
}

export function useRequestQuery(id: string | undefined) {
  return useQuery({
    queryKey: requestsQueryKeys.detail(id ?? ""),
    queryFn: () => getRequest(id ?? ""),
    enabled: Boolean(id),
  })
}
