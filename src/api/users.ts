import type { User } from "@/app/users/_constants/sample-users"

import { apiRequest } from "./client"

export function getUsers() {
  return apiRequest<User[]>("/api/users")
}

export function getUser(id: string) {
  return apiRequest<User>(`/api/users/${id}`)
}
