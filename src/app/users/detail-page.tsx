import { Link, useParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ApiErrorState from "@/app/_components/api-error-state"
import { useApiAuthRedirect } from "@/app/_hooks/use-api-auth-redirect"
import QueryStateLine from "@/app/_components/query-state-line"

import type { UserStatus } from "./_constants/sample-users"
import { useUserQuery } from "./_hooks/use-users-query"

export default function UserDetailPage() {
  const params = useParams()
  const userQuery = useUserQuery(params.id)
  const user = userQuery.data
  useApiAuthRedirect(userQuery.error)

  if (userQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (userQuery.isError) {
    return (
      <div className="space-y-6">
        <header>
          <p className="text-sm font-medium text-slate-500">Users</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">
            User Not Found
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            User dengan ID {params.id} tidak bisa dimuat.
          </p>
        </header>

        <ApiErrorState
          error={userQuery.error}
          fallbackMessage="User detail gagal dimuat."
          onRetry={() => void userQuery.refetch()}
        />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-slate-500">Users</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">
          User Detail
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Detail untuk user ID: {user.id}
        </p>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <QueryStateLine
          label="User detail query"
          isFetching={userQuery.isFetching}
          isStale={userQuery.isStale}
          onRefresh={() => void userQuery.refetch()}
        />

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-950">
              {user.name}
            </h3>
            <p className="text-sm text-slate-500">
              {user.email}
            </p>
          </div>
          <StatusBadge status={user.status} />
        </div>
      </section>

      <Button asChild variant="outline">
        <Link to="/users">Back to Users</Link>
      </Button>
    </div>
  )
}

function StatusBadge({ status }: { status: UserStatus }) {
  if (status === "Active") {
    return <Badge variant="success">{status}</Badge>
  }

  if (status === "Pending") {
    return <Badge variant="warning">{status}</Badge>
  }

  return <Badge variant="destructive">{status}</Badge>
}
