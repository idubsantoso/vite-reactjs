import { useState } from "react";
import type { Category } from "@/api/categories";
import { useCategoriesQuery } from "./_hooks/use-categories-query";
import { useDeleteCategoryMutation } from "./_hooks/use-delete-category-mutation";
import QueryStateLine from "../_components/query-state-line";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CategoriesTable from "./_components/category-table";
import { useNavigate } from "react-router-dom";

export default function CategoriesPage() {
    const categoriesQuery = useCategoriesQuery();
    const deleteCategoryMutation = useDeleteCategoryMutation();
    const navigate = useNavigate();
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

    const categories = categoriesQuery.data ?? [];
    const pendingDeleteCategoryId = deleteCategoryMutation.isPending ? deleteCategoryMutation.variables : undefined;

    async function handleDeleteCategory() {
        if(!deletingCategory) return;

        await deleteCategoryMutation.mutateAsync(deletingCategory.id);
        setDeletingCategory(null);
    }

    return (
        <div className="space-y-4">
            <div className="flex  flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                 <header>
                    <p className="text-sm font-medium text-slate-500">Categories</p>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-950">Category List</h2>
                 </header>

                 <Button type="button" onClick={() => navigate("/categories/create")}>
                    <Plus className="size-4" aria-hidden="true" />
                    Create Category
                 </Button>
            </div>

            {categoriesQuery.isLoading ? (
                <div className="text-center">Loading... check back soon!</div>
            ) : null}

            {categoriesQuery.isError ? (
                <div className="text-center text-red-600">
                    Something went wrong. Please try again later.
                </div>
            ) : null}

            {categoriesQuery.isSuccess && categories.length === 0 ? (
                <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8-text-center">
                    <h3 className="text-sm font-semibold text-slate-950">No categories found</h3>
                    <p className="mt-1 text-sm text-slate-600">
                        Create a new category to get started.
                    </p>
                </section>
            ) : null}
            
            {categoriesQuery.isSuccess && categories.length > 0 ? (
                <div className="space-y-3">
                    <QueryStateLine
                        label="Categories query"
                        isFetching={categoriesQuery.isFetching}
                        isStale={categoriesQuery.isStale}
                        onRefresh={() => categoriesQuery.refetch()}
                        />
                    {deleteCategoryMutation.isError ? (
                        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                            {getErrorMessage(deleteCategoryMutation.error,
                                "Something went wrong. Please try again later.")}
                        </p>
                    ) : null}

                    <CategoriesTable
                        categories={categories}
                        pendingDeleteCategoryId={pendingDeleteCategoryId}
                        onViewCategory={(category) => navigate(`/categories/${category.id}`)}
                        onEditCategory={(category) => navigate(`/categories/${category.id}/edit`)}
                        onDeleteCategory={setDeletingCategory}
                    />
                </div>
            ) : null}

                <Dialog
                    open={Boolean(deletingCategory)}
                    onOpenChange={(open) => {
                        if (!open) setDeletingCategory(null)
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Category</DialogTitle>
                            <DialogDescription>
                                This will delete the category.
                            </DialogDescription>
                        </DialogHeader>

                        {deleteCategoryMutation.isError ? (
                            <p className="text-sm text-red-600">
                                {getErrorMessage(deleteCategoryMutation.error, "Something went wrong. Please try again later.")}
                            </p>
                        ) : null}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={deleteCategoryMutation.isPending}
                                onClick={() => setDeletingCategory(null)}
                                >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                disabled={deleteCategoryMutation.isPending}
                                onClick={() => void handleDeleteCategory()}
                            >
                                {deleteCategoryMutation.isPending ? "Deleting..." : "Delete"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                </div>
    )
}

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback
}