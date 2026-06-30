import { updateCategory } from "@/api/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CategoryFormValues } from "../../_schemas/category-schema";
import { categoriesQueryKeys } from "../../_constants/category-query-keys";

export function useUpdateCategoryMutation() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, values }: { id: string; values: CategoryFormValues }) => updateCategory(id, values),
        onSuccess: (category) => {
            queryClient.invalidateQueries({
                queryKey: categoriesQueryKeys.detail(category.id),
            })
        },
    });
}