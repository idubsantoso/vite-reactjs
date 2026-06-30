import type { Category } from "@/api/categories"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Pencil, Trash2 } from "lucide-react"

type CategoryTableProps = {
    categories: Category[]
    pendingDeleteCategoryId?: string
    onViewCategory: (category: Category) => void
    onEditCategory: (category: Category) => void
    onDeleteCategory: (category: Category) => void
}

export default function CategoriesTable({
    categories,
    pendingDeleteCategoryId,
    onEditCategory,
    onDeleteCategory,
    onViewCategory,
}: CategoryTableProps) {
    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                            <span className="block text-right">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {categories.map((category) => {
                        const isDeleting = pendingDeleteCategoryId === category.id
                        const isActionDisabled = Boolean(pendingDeleteCategoryId)

                        return (
                            <TableRow key={category.id}>
                                <TableCell>
                                    <div className="font-medium text-slate-950">{category.name}</div>
                                </TableCell>

                                <TableCell className="text-slate-600">
                                    {category.description || "-"}
                                </TableCell>

                                <TableCell>
                                    <Badge variant={category.isActive ? "default" : "secondary"}>
                                        {category.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    <div className="flex flex-wrap justify-end gap-2">
                                        <Button 
                                            type="button" 
                                            size="sm" 
                                            variant="outline" 
                                            disabled={isActionDisabled} 
                                            aria-label={`View ${category.name}`} 
                                            onClick={() => onViewCategory(category)}
                                        >
                                            <Eye className="size-4" aria-hidden="true" />
                                            View
                                        </Button>

                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            disabled={isActionDisabled}
                                            aria-label={`Edit ${category.name}`}
                                            onClick={() => onEditCategory(category)}
                                        >
                                            <Pencil className="size-4" aria-hidden="true" />
                                            Edit
                                        </Button>

                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            disabled={isActionDisabled}
                                            aria-label={`Delete ${category.name}`}
                                            onClick={() => onDeleteCategory(category)}
                                        >
                                            <Trash2 className="size-4" aria-hidden="true" />
                                            Delete
                                        </Button>

                                        {isDeleting ? (
                                            <span className="basis-full text-right text-xs text-slate-500">Deleting...</span>
                                        ) : null}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
        })}
                </TableBody>
            </Table>
        </section>
    )
}