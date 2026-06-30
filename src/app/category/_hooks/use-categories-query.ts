import { getCategories } from "@/api/categories";
import { useQuery } from "@tanstack/react-query";
import { categoriesQueryKeys } from "../_constants/category-query-keys";

export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoriesQueryKeys.all,
    queryFn: () => getCategories(),
  })
}