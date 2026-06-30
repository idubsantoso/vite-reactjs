import type { QueryClient } from "@tanstack/react-query";
import type { Category } from "@/api/categories";
import { categoriesQueryKeys } from "../_constants/category-query-keys";

export function invalidCategoryCollections(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
}

export function invalidateCategoryQueries(queryClient: QueryClient, category: Category) {
  invalidCategoryCollections(queryClient)
  void queryClient.invalidateQueries({
    queryKey: categoriesQueryKeys.detail(category.id),
  })
}