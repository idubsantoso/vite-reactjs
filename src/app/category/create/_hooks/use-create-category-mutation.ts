import { createCategory } from "@/api/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesQueryKeys } from "../../_constants/category-query-keys";

export function useCreateCategoryMutation() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all })
        },
    });
}