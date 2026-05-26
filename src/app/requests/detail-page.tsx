import { Link, useParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import QueryStateLine from "@/app/_components/query-state-line"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { MockRequest } from "@/mocks/data"

import { useUpdateRequestStatusMutation } from "./_hooks/use-request-mutations"
import { useRequestQuery } from "./_hooks/use-requests-query"

export default function RequestDetailPage() {
  const params = useParams()
  const requestQuery = useRequestQuery(params.id)
  const updateRequestStatusMutation = useUpdateRequestStatusMutation()
  const request = requestQuery.data

  function handleUpdateStatus(status: MockRequest["status"]) {
    if (!request) {
      return
    }

    updateRequestStatusMutation.mutate({ id: request.id, status })
  }

  if (requestQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (requestQuery.isError) {
    const errorMessage = requestQuery.error instanceof Error
      ? requestQuery.error.message
      : "Request detail gagal dimuat."

    return (
      <div className="space-y-6">
        <header>
          <p className="text-sm font-medium text-slate-500">Requests</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">
            Request Not Found
          </h2>
          <p className="mt-2 text-sm text-slate-600">{errorMessage}</p>
        </header>

        <Button type="button" onClick={() => void requestQuery.refetch()}>
          Reload request
        </Button>

        <Button asChild variant="outline">
          <Link to="/requests">Back to Requests</Link>
        </Button>
      </div>
    )
  }

  if (!request) {
    return null
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-slate-500">Requests</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">
          Request Detail
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Detail untuk request ID: {request.id}
        </p>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <QueryStateLine
          label="Request detail query"
          isFetching={requestQuery.isFetching}
          isStale={requestQuery.isStale}
          onRefresh={() => void requestQuery.refetch()}
        />

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-950">
              {request.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Owner: {request.owner}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Submitted: {formatRequestDate(request.submittedAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <RequestStatusBadge status={request.status} />
            <Select
              value={request.status}
              disabled={updateRequestStatusMutation.isPending}
              onValueChange={(status) =>
                handleUpdateStatus(status as MockRequest["status"])
              }
            >
              <SelectTrigger className="w-36" aria-label="Update request status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {updateRequestStatusMutation.isError ? (
          <p className="mt-4 text-sm text-red-600">
            {updateRequestStatusMutation.error instanceof Error
              ? updateRequestStatusMutation.error.message
              : "Status request gagal diupdate."}
          </p>
        ) : null}
        {updateRequestStatusMutation.isPending ? (
          <p className="mt-4 text-sm text-slate-500">
            Updating request status...
          </p>
        ) : null}
      </section>

      <Button asChild variant="outline">
        <Link to="/requests">Back to Requests</Link>
      </Button>
    </div>
  )
}

function RequestStatusBadge({ status }: { status: MockRequest["status"] }) {
  if (status === "Approved") {
    return <Badge variant="success">{status}</Badge>
  }

  if (status === "Rejected") {
    return <Badge variant="destructive">{status}</Badge>
  }

  return <Badge variant="warning">{status}</Badge>
}

function formatRequestDate(submittedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(submittedAt))
}
