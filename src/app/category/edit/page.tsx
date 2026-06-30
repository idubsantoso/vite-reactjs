import { useNavigate, useParams } from "react-router-dom";
import { useCategoryQuery } from "../_hooks/use-category-query";
import { useUpdateCategoryMutation } from "../_hooks/use-update-category-mutation";
import type { CategoryFormValues } from "../_schemas/category-schema";
import { CategoryForm } from "../_components/category-form";

export default function EditCategoryPage() {
    const navigate = useNavigate();
    const {id} = useParams();

    const categoryQuery = useCategoryQuery(id ?? "");
    const updateCategoryMutation = useUpdateCategoryMutation();

    async function handleSubmit(values: CategoryFormValues) {
        await updateCategoryMutation.mutateAsync({
            id : id ?? "",
            values,
        });
        navigate("/categories");
    }

    if (!id) {
        return <div className="text-center">Invalid category id</div>
    }

    if (categoryQuery.isLoading) {
        return <div className="text-center">Loading... check back soon!</div>
    }

    if (categoryQuery.isError || !categoryQuery.data) {
        return <div className="text-center">Something went wrong. Please try again later.</div>
    }

    const category = categoryQuery.data;

    return (
        <div className="space-y-4">
            <header>
                <p className="text-sm font-medium text-slate-500">Categories</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">Edit Category</h2>
            </header>

            <CategoryForm
                mode="edit"
                defaultValues={{
                    name: category.name,
                    description: category.description ?? "",
                    isActive: category.isActive,
                }}
                onSubmit={handleSubmit}
            />
            </div>
        )
    }