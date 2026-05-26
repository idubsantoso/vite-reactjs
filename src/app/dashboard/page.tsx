import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import QueryStateLine from "@/app/_components/query-state-line"
import type { MockRequest } from "@/mocks/data"

import type { User } from "../users/_constants/sample-users"
import { useRequestsQuery } from "../requests/_hooks/use-requests-query"
import { useUsersQuery } from "../users/_hooks/use-users-query"
import DashboardSummary from "./_components/dashboard-summary"

type SummaryItem = {
  label: string
  value: string
  meta: string
}

export default function DashboardPage() {
  const usersQuery = useUsersQuery()
  const requestsQuery = useRequestsQuery()
  const isLoading = usersQuery.isLoading || requestsQuery.isLoading
  const isFetching = usersQuery.isFetching || requestsQuery.isFetching
  const isStale = usersQuery.isStale || requestsQuery.isStale
  const isError = usersQuery.isError || requestsQuery.isError
  const error = usersQuery.error ?? requestsQuery.error
  const errorMessage = error instanceof Error
    ? error.message
    : "Dashboard gagal dimuat."
  const summaryItems = usersQuery.data && requestsQuery.data
    ? createSummaryItems(usersQuery.data, requestsQuery.data)
    : []

  function refetchDashboard() {
    void usersQuery.refetch()
    void requestsQuery.refetch()
  }

  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-slate-500">Dashboard</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">
          Dashboard Overview
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Ringkasan data utama untuk memantau kondisi backoffice.
        </p>
      </header>

      {isLoading ? (
        <section
          aria-label="Dashboard summary loading"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 w-full" />
          ))}
        </section>
      ) : null}

      {!isLoading && isError ? (
        <section className="rounded-lg border border-rose-200 bg-rose-50 p-6">
          <h3 className="text-base font-semibold text-rose-950">
            Dashboard gagal dimuat
          </h3>
          <p className="mt-2 text-sm text-rose-800">{errorMessage}</p>
          <Button
            type="button"
            variant="destructive"
            className="mt-5"
            onClick={refetchDashboard}
          >
            Reload dashboard
          </Button>
        </section>
      ) : null}

      {!isLoading && !isError ? (
        <>
          <QueryStateLine
            label="Dashboard queries"
            isFetching={isFetching}
            isStale={isStale}
            onRefresh={refetchDashboard}
          />
          <DashboardSummary items={summaryItems} />
        </>
      ) : null}
    </div>
  )
}

function createSummaryItems(
  users: User[],
  requests: MockRequest[],
): SummaryItem[] {
  const activeUsers = users.filter((user) => user.status === "Active").length
  const pendingUsers = users.filter((user) => user.status === "Pending").length
  const adminUsers = users.filter((user) => user.role === "Admin").length
  const pendingRequests = requests.filter(
    (request) => request.status === "Pending",
  ).length

  return [
    {
      label: "Total Users",
      value: users.length.toLocaleString("en-US"),
      meta: `${activeUsers} active users`,
    },
    {
      label: "Active Users",
      value: activeUsers.toLocaleString("en-US"),
      meta: users.length > 0
        ? `${Math.round((activeUsers / users.length) * 100)}% activation rate`
        : "0% activation rate",
    },
    {
      label: "Pending Requests",
      value: pendingRequests.toLocaleString("en-US"),
      meta: `${requests.length} total requests`,
    },
    {
      label: "Admins",
      value: adminUsers.toLocaleString("en-US"),
      meta: `${pendingUsers} pending users`,
    },
  ]
}
