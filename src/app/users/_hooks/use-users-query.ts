import { useQuery } from "@tanstack/react-query"

import { getUsers } from "@/api/users"

import { usersQueryKeys } from "../_constants/user-query-keys"

export function useUsersQuery() {
  return useQuery({
    queryKey: usersQueryKeys.lists(),
    queryFn: getUsers,
  })
}
