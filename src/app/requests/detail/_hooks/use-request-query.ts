import { useQuery } from "@tanstack/react-query"

import { getRequest } from "@/api/requests"

import { requestsQueryKeys } from "../../_constants/request-query-keys"

export function useRequestQuery(id: string | undefined) {
  return useQuery({
    queryKey: requestsQueryKeys.detail(id ?? ""),
    queryFn: () => getRequest(id ?? ""),
    enabled: Boolean(id),
  })
}
