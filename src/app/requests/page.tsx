import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ApiErrorState from "@/app/_components/api-error-state"
import { useApiAuthRedirect } from "@/app/_hooks/use-api-auth-redirect"
import QueryStateLine from "@/app/_components/query-state-line"
import type { MockRequest } from "@/mocks/data"

import RequestsTable from "./_components/requests-table"
import { useUpdateRequestStatusMutation } from "./_hooks/use-request-mutations"
import { useRequestsQuery } from "./_hooks/use-requests-query"

export default function RequestsPage() {
  const requestsQuery = useRequestsQuery()
  const updateRequestStatusMutation = useUpdateRequestStatusMutation()
  const requests = requestsQuery.data ?? []
  useApiAuthRedirect(requestsQuery.error)
  useApiAuthRedirect(updateRequestStatusMutation.error)
  const pendingRequestId = updateRequestStatusMutation.isPending
    ? updateRequestStatusMutation.variables?.id
    : undefined

  function handleUpdateStatus(
    request: MockRequest,
    status: MockRequest["status"],
  ) {
    updateRequestStatusMutation.mutate({ id: request.id, status })
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-slate-500">Requests</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">
          Request List
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Semua request bisa dibuka ke route detail.
        </p>
      </header>

      {requestsQuery.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : null}

      {requestsQuery.isError ? (
        <ApiErrorState
          error={requestsQuery.error}
          fallbackMessage="Data requests gagal dimuat."
          onRetry={() => void requestsQuery.refetch()}
        />
      ) : null}

      {requestsQuery.isSuccess && requests.length === 0 ? (
        <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <h3 className="text-base font-semibold text-slate-950">
            Tidak ada request
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
            Mock API mengembalikan data requests kosong.
          </p>
          <Button
            type="button"
            className="mt-5"
            onClick={() => void requestsQuery.refetch()}
          >
            Reload requests
          </Button>
        </section>
      ) : null}

      {requestsQuery.isSuccess && requests.length > 0 ? (
        <div className="space-y-3">
          <QueryStateLine
            label="Requests query"
            isFetching={requestsQuery.isFetching}
            isStale={requestsQuery.isStale}
            onRefresh={() => void requestsQuery.refetch()}
          />
          {updateRequestStatusMutation.isSuccess ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Request status updated.
            </p>
          ) : null}
          {updateRequestStatusMutation.isError ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {updateRequestStatusMutation.error instanceof Error
                ? updateRequestStatusMutation.error.message
                : "Request status gagal diupdate."}
            </p>
          ) : null}
          <RequestsTable
            requests={requests}
            pendingRequestId={pendingRequestId}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      ) : null}
    </div>
  )
}
