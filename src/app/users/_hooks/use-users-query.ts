import { useQuery } from "@tanstack/react-query"

import { getUser, getUsers } from "@/api/users"

export const usersQueryKeys = {
  all: ["users"] as const,
  lists: () => [...usersQueryKeys.all, "list"] as const,
  details: () => [...usersQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...usersQueryKeys.details(), id] as const,
}

export function useUsersQuery() {
  return useQuery({
    queryKey: usersQueryKeys.lists(),
    queryFn: getUsers,
  })
}

export function useUserQuery(id: string | undefined) {
  return useQuery({
    queryKey: usersQueryKeys.detail(id ?? ""),
    queryFn: () => getUser(id ?? ""),
    enabled: Boolean(id),
  })
}
