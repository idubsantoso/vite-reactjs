import type { CurrentUser, LoginCredentials } from "@/app/login/_types/auth"

import { apiDataRequest } from "./client"

type LoginResponse = {
  token: string
  user: CurrentUser
}

type ApiUser = {
  id: string
  name: string
  email: string
  role: string
}

type ApiLoginResponse = ApiUser & {
  access_token: string
  access_token_expired_at?: string
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const data = await apiDataRequest<ApiLoginResponse>("/auth/login", {
    method: "POST",
    body: credentials,
    redirectOnUnauthorized: false,
  })

  return {
    token: data.access_token,
    user: mapCurrentUser(data),
  }
}

export async function getCurrentUser() {
  const data = await apiDataRequest<ApiUser>("/auth/me", {
    scenarioParam: "authScenario",
  })

  return mapCurrentUser(data)
}

function mapCurrentUser(user: ApiUser): CurrentUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: toDisplayValue(user.role),
  }
}

function toDisplayValue(value: string) {
  if (!value) {
    return value
  }

  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}
