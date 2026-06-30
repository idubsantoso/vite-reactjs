import { useNavigate } from "react-router-dom";
import { useCreateCategoryMutation } from "../_hooks/use-create-category-mutation";
import type { CategoryFormValues } from "../_schemas/category-schema";
import { CategoryForm } from "../_components/category-form";

export default function CreateCategoryPage() {
    const navigate = useNavigate();
    const createCategoryMutation = useCreateCategoryMutation();

    async function handleSubmit(values: CategoryFormValues) {
        await createCategoryMutation.mutateAsync(values);
        navigate("/categories");
    }

    return (
        <div className="space-y-4">
            <header>
                <p className="text-sm font-medium text-slate-500">Categories</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">Create Category</h2>
            </header>

            <CategoryForm onSubmit={handleSubmit} />

            {createCategoryMutation.isError ? (
                <p className="text-sm text-red-600">
                    {createCategoryMutation.error instanceof Error
                        ? createCategoryMutation.error.message
                        :
                        "Something went wrong. Please try again later."}
                </p>
            ) : null}
        </div>
    )
}