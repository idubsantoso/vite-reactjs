import { useState } from "react";
import type { CategoryFormValues } from "./_schemas/category-schema";
import type { Category } from "@/api/categories";
import { useCategoriesQuery } from "./_hooks/use-categories-query";
import { useCreateCategoryMutation } from "./_hooks/use-create-category-mutation";
import { useUpdateCategoryMutation } from "./_hooks/use-update-category-mutation";
import { useDeleteCategoryMutation } from "./_hooks/use-delete-category-mutation";
import QueryStateLine from "../_components/query-state-line";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { CategoryForm } from "./_components/category-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CategoriesTable from "./_components/categories-table";

export default function CategoriesPage() {
    const categoriesQuery = useCategoriesQuery();
    const createCategoryMutation = useCreateCategoryMutation();
    const updateCategoryMutation = useUpdateCategoryMutation();
    const deleteCategoryMutation = useDeleteCategoryMutation();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

    const categories = categoriesQuery.data ?? [];
    const pendingDeleteCategoryId = deleteCategoryMutation.isPending ? deleteCategoryMutation.variables : undefined;

    async function handleCreateCategory(values: CategoryFormValues) {
        await createCategoryMutation.mutateAsync(values);
        setIsCreateDialogOpen(false);
    }

    async function handleUpdateCategory(values: CategoryFormValues) {
        if (!editingCategory) return;

        await updateCategoryMutation.mutateAsync({
            id: editingCategory.id,
            values,
        });
        setEditingCategory(null);
    }

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

                 <Button type="button" onClick={() => setIsCreateDialogOpen(true)}>
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
                        onEditCategory={setEditingCategory}
                        onDeleteCategory={setDeletingCategory}
                    />
                </div>
            ) : null}

            <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Category</DialogTitle>
                            <DialogDescription>
                                This will create a new category.
                            </DialogDescription>
                        </DialogHeader>

                        <CategoryForm onSubmit={handleCreateCategory} />

                        {createCategoryMutation.isError ? (
                            <p className="text-sm text-red-600">
                                {getErrorMessage(createCategoryMutation.error,
                                    "Something went wrong. Please try again later.")}
                            </p>
                        ) : null}
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={Boolean(editingCategory)}
                    onOpenChange={(open) => {
                        if (!open) setEditingCategory(null)
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>
                                This will update the category.
                            </DialogDescription>
                        </DialogHeader>

                        {editingCategory ? (
                            <CategoryForm
                                key={editingCategory.id}
                                mode="edit"
                                defaultValues={{
                                    name: editingCategory.name,
                                    description: editingCategory.description ?? "",
                                    isActive: editingCategory.isActive,
                                }}
                                onSubmit={handleUpdateCategory}
                            />
                        ) : null}

                        {updateCategoryMutation.isError ? (
                            <p className="text-sm text-red-600">
                                {getErrorMessage(updateCategoryMutation.error, "Something went wrong. Please try again later.")}

                            </p>
                        ) : null}
                    </DialogContent>
                </Dialog>

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