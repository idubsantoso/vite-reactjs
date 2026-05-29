import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"

import { ApiError } from "@/api/client"
import {
  AUTH_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_ID_STORAGE_KEY,
} from "@/app/_constants/auth-storage"

export function useApiAuthRedirect(error: unknown) {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!(error instanceof ApiError) || error.status !== 401) {
      return
    }

    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(AUTH_USER_ID_STORAGE_KEY)
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    queryClient.clear()
    navigate("/login", { replace: true, state: { from: location } })
  }, [error, location, navigate, queryClient])
}
