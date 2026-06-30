import { zodResolver } from "@hookform/resolvers/zod"
import { categorySchema, type CategoryFormValues } from "../_schemas/category-schema"
import { Controller, useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CategoryFormProps = {
    defaultValues?: CategoryFormValues
    mode?: "create" | "edit"
    onSubmit: (values: CategoryFormValues) => Promise<void> | void
}

const emptyCategoryValues: CategoryFormValues = {
    name: "",
    description: "",
    isActive: true,
}

export function CategoryForm({ defaultValues, mode, onSubmit }: CategoryFormProps) {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: defaultValues ?? emptyCategoryValues,
    })
    return (
        < form
            className="grip gap-4"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="grip gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="name">
                    Name
                </label>
                <Input id="name" {...register("name")} />
                {errors.name ? (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                ) : null}
            </div>
            <div className="grip gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="description">
                    Description
                </label>
                <Input id="description" placeholder="Optional" {...register("description")} />
                {errors.description ? (
                    <p className="text-sm text-red-600">{errors.description.message}</p>
                ) : null}
            </div>
            <div className="grip gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="isActive">
                    Is Active
                </label>
                <Controller
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                        <Select
                            value={field.value ? "active" : "inactive"}
                            onValueChange={(value) =>
                                field.onChange(value === "active")
                            }
                        >
                            <SelectTrigger
                                id="isActive"
                            >
                                <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                            </SelectContent>

                        </Select>
                    )}
                    />
                {errors.isActive ? (
                    <p className="text-sm text-red-600">{errors.isActive.message}</p>
                ) : null}
            </div>
            <div className="text justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : mode === "edit" ? "Update" : "Create"}
                </Button>
            </div>
        </form >
    )
}