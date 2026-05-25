import { useEffect, useState } from "react"

import { getCurrentUser, login as loginRequest } from "@/api/auth"
import {
  AUTH_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_ID_STORAGE_KEY,
} from "@/app/_constants/auth-storage"

import type { CurrentUser, LoginCredentials } from "../_types/auth"

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [isLoading, setIsLoading] = useState(() => hasStoredToken())

  useEffect(() => {
    let isMounted = true

    async function loadCurrentUser() {
      if (!hasStoredToken()) {
        setIsLoading(false)
        return
      }

      try {
        const user = await getCurrentUser()

        if (isMounted) {
          storeAuthenticatedUser(user)
          setCurrentUser(user)
        }
      } catch {
        clearStoredAuth()

        if (isMounted) {
          setCurrentUser(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadCurrentUser()

    return () => {
      isMounted = false
    }
  }, [])

  async function login(credentials: LoginCredentials) {
    const loginResponse = await loginRequest(credentials)

    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, loginResponse.token)
    storeAuthenticatedUser(loginResponse.user)
    setCurrentUser(loginResponse.user)

    return loginResponse.user
  }

  function logout() {
    clearStoredAuth()
    setCurrentUser(null)
  }

  return {
    currentUser,
    isAuthenticated: currentUser !== null,
    isLoading,
    login,
    logout,
  }
}

function hasStoredToken() {
  return Boolean(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY))
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
