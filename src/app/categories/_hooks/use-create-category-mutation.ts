import { createCategory } from "@/api/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidCategoryCollections } from "../_utils/invalidate-category-queries";

export function useCreateCategoryMutation() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            invalidCategoryCollections(queryClient);
        },
    });
}