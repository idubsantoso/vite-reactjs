export const requestsQueryKeys = {
  all: ["requests"] as const,
  lists: () => [...requestsQueryKeys.all, "list"] as const,
  details: () => [...requestsQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...requestsQueryKeys.details(), id] as const,
}
