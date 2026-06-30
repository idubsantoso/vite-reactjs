import { deleteCategory } from "@/api/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesQueryKeys } from "../_constants/category-query-keys";

export function useDeleteCategoryMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
        },
    });
}