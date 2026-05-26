import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { login as loginRequest } from "@/api/auth"
import {
  AUTH_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_ID_STORAGE_KEY,
} from "@/app/_constants/auth-storage"

import {
  currentUserQueryKey,
  useCurrentUserQuery,
} from "./use-current-user-query"
import type { CurrentUser, LoginCredentials } from "../_types/auth"

export function useAuth() {
  const queryClient = useQueryClient()
  const currentUserQuery = useCurrentUserQuery()
  const currentUser = currentUserQuery.data ?? null

  useEffect(() => {
    if (currentUserQuery.isError) {
      clearStoredAuth()
      queryClient.removeQueries({ queryKey: currentUserQueryKey })
    }
  }, [currentUserQuery.isError, queryClient])

  async function login(credentials: LoginCredentials) {
    const loginResponse = await loginRequest(credentials)

    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, loginResponse.token)
    storeAuthenticatedUser(loginResponse.user)
    queryClient.setQueryData(currentUserQueryKey, loginResponse.user)

    return loginResponse.user
  }

  function logout() {
    clearStoredAuth()
    queryClient.removeQueries({ queryKey: currentUserQueryKey })
  }

  return {
    currentUser,
    isAuthenticated: currentUser !== null,
    isLoading: currentUserQuery.isLoading,
    login,
    logout,
  }
}

function storeAuthenticatedUser(user: CurrentUser) {
  localStorage.setItem(AUTH_STORAGE_KEY, "true")
  localStorage.setItem(AUTH_USER_ID_STORAGE_KEY, user.id)
}

function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(AUTH_USER_ID_STORAGE_KEY)
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
}
