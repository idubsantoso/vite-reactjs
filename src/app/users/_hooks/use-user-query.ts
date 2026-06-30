import { useQuery } from "@tanstack/react-query"

import { getUser } from "@/api/users"

import { usersQueryKeys } from "../_constants/user-query-keys"

export function useUserQuery(id: string | undefined) {
  return useQuery({
    queryKey: usersQueryKeys.detail(id ?? ""),
    queryFn: () => getUser(id ?? ""),
    enabled: Boolean(id),
  })
}
