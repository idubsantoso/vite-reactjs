import { useParams } from "react-router-dom";
import { useCategoryQuery } from "./_hooks/use-category-query";
import { Badge } from "@/components/ui/badge";

export default function DetailCategoryPage() {
    const params = useParams();
    const categoryQuery = useCategoryQuery(params.id ?? "");

    if (categoryQuery.isLoading) {
        return <div className="text-center">Loading... check back soon!</div>
    }

    if (categoryQuery.isError || !categoryQuery.data) {
        return <div className="text-center">Something went wrong. Please try again later.</div>
    }

    const category = categoryQuery.data;

    if (!category) {
        return null
    }

    return (
        <div className="space-y-4">
            <header>
                <p className="text-sm font-medium text-slate-500">Categories</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">Edit Category</h2>
            </header>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                    <p className="text-sm font-medium text-slate-500">Name</p>
                    <p className="font-medium text-slate-950">{category.name}</p>
                </div>

                <div>
                    <p className="text-sm font-medium text-slate-500">Description</p>
                    <p className="text-slate-700">{category.description ?? "-"}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">Status</p>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                </div>
            </section>
            </div>
        )
    }