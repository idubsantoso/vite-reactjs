import { Link } from "react-router-dom"

import { ApiError } from "@/api/client"
import { Button } from "@/components/ui/button"

type ApiErrorStateProps = {
  error: unknown
  fallbackMessage: string
  onRetry?: () => void
}

export default function ApiErrorState({
  error,
  fallbackMessage,
  onRetry,
}: ApiErrorStateProps) {
  const status = error instanceof ApiError ? error.status : null
  const message = error instanceof Error ? error.message : fallbackMessage
  const state = getErrorState(status)

  return (
    <section
      aria-labelledby="api-error-title"
      role="alert"
      className="rounded-lg border border-rose-200 bg-rose-50 p-6"
    >
      <p className="text-sm font-medium text-rose-700">{state.kicker}</p>
      <h3
        id="api-error-title"
        className="mt-1 text-base font-semibold text-rose-950"
      >
        {state.title}
      </h3>
      <p className="mt-2 text-sm text-rose-800">{message}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {state.action === "login" ? (
          <Button asChild>
            <Link to="/login">Back to Login</Link>
          </Button>
        ) : null}
        {state.action === "dashboard" ? (
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        ) : null}
        {onRetry ? (
          <Button type="button" variant="destructive" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </div>
    </section>
  )
}

function getErrorState(status: number | null) {
  if (status === 401) {
    return {
      action: "login",
      kicker: "401",
      title: "Authentication required",
    } as const
  }

  if (status === 403) {
    return {
      action: "dashboard",
      kicker: "403",
      title: "Forbidden",
    } as const
  }

  if (status === 500) {
    return {
      action: "retry",
      kicker: "500",
      title: "Server error",
    } as const
  }

  return {
    action: "retry",
    kicker: "Request failed",
    title: "Data failed to load",
  } as const
}
