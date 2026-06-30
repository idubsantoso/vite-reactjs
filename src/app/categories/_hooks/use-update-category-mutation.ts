import { updateCategory } from "@/api/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateCategoryQueries } from "../_utils/invalidate-category-queries";
import type { CategoryFormValues } from "../_schemas/category-schema";

export function useUpdateCategoryMutation() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, values }: { id: string; values: CategoryFormValues }) => updateCategory(id, values),
        onSuccess: (category) => {
            invalidateCategoryQueries(queryClient, category);
        },
    });
}