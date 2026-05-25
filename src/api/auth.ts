import type { CurrentUser, LoginCredentials } from "@/app/login/_types/auth"

import { apiRequest } from "./client"

type LoginResponse = {
  token: string
  user: CurrentUser
}

export function login(credentials: LoginCredentials) {
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: credentials,
  })
}

export function getCurrentUser() {
  return apiRequest<CurrentUser>("/api/auth/me")
}
