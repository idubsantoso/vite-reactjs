import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "../login/_hooks/use-auth"

export default function ProtectedRoute() {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-sm text-slate-600">
        Loading session...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
