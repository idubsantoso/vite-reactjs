import type { User } from "@/app/users/_constants/sample-users"
import type { UserFormValues } from "@/app/users/_schemas/user-schema"

import { apiRequest } from "./client"

export function getUsers() {
  return apiRequest<User[]>("/api/users")
}

export function getUser(id: string) {
  return apiRequest<User>(`/api/users/${id}`)
}

export function createUser(values: UserFormValues) {
  return apiRequest<User>("/api/users", {
    method: "POST",
    body: values,
  })
}

export function updateUser(id: string, values: UserFormValues) {
  return apiRequest<User>(`/api/users/${id}`, {
    method: "PUT",
    body: values,
  })
}

export function updateUserStatus(id: string, status: User["status"]) {
  return apiRequest<User>(`/api/users/${id}/status`, {
    method: "PATCH",
    body: { status },
  })
}
