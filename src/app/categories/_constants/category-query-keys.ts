export const categoriesQueryKeys = {
    all: ["categories"] as const,
    lists: () => [...categoriesQueryKeys.all, "list"] as const,
    list: (filters: string) => [...categoriesQueryKeys.lists(), { filters }] as const,
    details: () => [...categoriesQueryKeys.all, "detail"] as const,
    detail: (id: string) => [...categoriesQueryKeys.details(), id] as const,
}