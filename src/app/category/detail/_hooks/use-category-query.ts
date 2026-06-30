import { useQuery } from "@tanstack/react-query";
import { getCategory } from "@/api/categories";
import { categoriesQueryKeys } from "../../_constants/category-query-keys";

export function useCategoryQuery(id: string) {
  return useQuery({
    queryKey: categoriesQueryKeys.detail(id),
    queryFn: () => getCategory(id),
  })
}