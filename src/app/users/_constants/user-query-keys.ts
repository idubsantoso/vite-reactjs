export const usersQueryKeys = {
  all: ["users"] as const,
  lists: () => [...usersQueryKeys.all, "list"] as const,
  details: () => [...usersQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...usersQueryKeys.details(), id] as const,
}
