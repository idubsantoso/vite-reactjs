import { useState } from "react"

import {
  AUTH_STORAGE_KEY,
  AUTH_USER_ID_STORAGE_KEY,
} from "@/app/_constants/auth-storage"
import { getSimpleUsers } from "@/app/users/_constants/sample-users"

import type { CurrentUser, LoginCredentials } from "../_types/auth"

function toCurrentUser(userId: string | null): CurrentUser | null {
  const user = getSimpleUsers().find((sampleUser) => sampleUser.id === userId)

  if (!user) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

function getStoredUser() {
  const isAuthenticated = localStorage.getItem(AUTH_STORAGE_KEY) === "true"

  if (!isAuthenticated) {
    return null
  }

  const currentUser = toCurrentUser(localStorage.getItem(AUTH_USER_ID_STORAGE_KEY))

  if (!currentUser) {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(AUTH_USER_ID_STORAGE_KEY)
  }

  return currentUser
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() =>
    getStoredUser(),
  )

  function login(credentials: LoginCredentials) {
    const user = getSimpleUsers().find(
      (sampleUser) =>
        sampleUser.email === credentials.email &&
        sampleUser.password === credentials.password,
    )

    if (!user) {
      return null
    }

    const currentUser = toCurrentUser(user.id)

    localStorage.setItem(AUTH_STORAGE_KEY, "true")
    localStorage.setItem(AUTH_USER_ID_STORAGE_KEY, user.id)
    setCurrentUser(currentUser)

    return currentUser
  }

  function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(AUTH_USER_ID_STORAGE_KEY)
    setCurrentUser(null)
  }

  return {
    currentUser,
    isAuthenticated: currentUser !== null,
    login,
    logout,
  }
}
