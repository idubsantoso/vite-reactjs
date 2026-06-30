import { deleteCategory } from "@/api/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidCategoryCollections } from "../_utils/invalidate-category-queries";

export function useDeleteCategoryMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            invalidCategoryCollections(queryClient);
        },
    });
}