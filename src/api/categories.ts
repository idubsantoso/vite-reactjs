import type { CategoryFormValues } from "@/app/category/_schemas/category-schema"
import { apiDataRequest, apiItemsRequest, apiRequest } from "./client"

export type Category = {
  id: string
  name: string
  description: string
  isActive: boolean
}

type ApiCategory = {
  id: string
  name: string
  description: string
  isActive: boolean
}

export async function getCategories() {
    const categories = await apiItemsRequest<ApiCategory>("/categories")
    return categories.map(mapCategory)
}

export async function getCategory(id: string) {
    const data = await apiDataRequest<ApiCategory | { items?: ApiCategory[] }>(`/categories/${id}`)
    return mapCategory(getApiRequestFromData(data, id))
}

export async function createCategory(values: CategoryFormValues) {
    const data = await apiDataRequest<ApiCategory | { items?: ApiCategory[] }>("/categories", {
        method: "POST",
        body: mapCategoryPayload(values),
    })

    return mapCategory(getApiRequestFromData(data))
}

export async function updateCategory(id: string, values: CategoryFormValues) {
    const data = await apiDataRequest<ApiCategory | { items?: ApiCategory[] }>(`/categories/${id}`, {
        method: "PATCH",
        body: mapCategoryPayload(values),
    })

    return mapCategory(getApiRequestFromData(data, id))
}

export async function deleteCategory(id: string) {
    await apiRequest<void>(`/categories/${id}`, {
        method: "DELETE",
    })
}

function mapCategory(category: ApiCategory): Category {
  return {
    id: category.id,
    name: category.name,
    description: category.description ?? "",
    isActive: category.isActive ? category.isActive : true,
  }
}

function mapCategoryPayload(values: CategoryFormValues){
    const description = values.description?.trim()

    return {
        name: values.name,
        description: description,
        is_active: values.isActive,
    }
}

function getApiRequestFromData(data: Category | { items?: Category[] }, id?: string): Category {
  if ("items" in data) {
    const item = data.items?.find((item) => item.id === id)

    if (!item) {
      throw new Error(`Category with id ${id} not found`)
    }

    return item
  }

  return data as Category
}