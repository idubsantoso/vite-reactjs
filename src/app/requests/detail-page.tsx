import { Link, useParams } from "react-router-dom"

import { ApiError } from "@/api/client"
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
import type { RequestStatusScenario } from "@/api/requests"

import { useUpdateRequestStatusMutation } from "./_hooks/use-request-mutations"
import { useRequestQuery } from "./_hooks/use-requests-query"

export default function RequestDetailPage() {
  const params = useParams()
  const requestQuery = useRequestQuery(params.id)
  const updateRequestStatusMutation = useUpdateRequestStatusMutation()
  const request = requestQuery.data

  function handleUpdateStatus(
    status: MockRequest["status"],
    scenario?: RequestStatusScenario,
  ) {
    if (!request) {
      return
    }

    updateRequestStatusMutation.mutate({ id: request.id, status, scenario })
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
            <p className="mt-1 text-sm text-slate-600">
              Assignee: {request.assignee}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Submitted: {formatRequestDate(request.submittedAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <RequestStatusBadge status={request.status} />
            <PriorityBadge priority={request.priority} />
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

        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={updateRequestStatusMutation.isPending}
            onClick={() => handleUpdateStatus("Approved")}
          >
            Approve request
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={updateRequestStatusMutation.isPending}
            onClick={() => handleUpdateStatus("Rejected")}
          >
            Reject request
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={updateRequestStatusMutation.isPending}
            onClick={() => handleUpdateStatus(request.status, "403")}
          >
            Simulate 403
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={updateRequestStatusMutation.isPending}
            onClick={() => handleUpdateStatus(request.status, "500")}
          >
            Simulate 500
          </Button>
        </div>

        {updateRequestStatusMutation.isError ? (
          <RequestStatusUpdateError error={updateRequestStatusMutation.error} />
        ) : null}
        {updateRequestStatusMutation.isPending ? (
          <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Updating request status...
          </p>
        ) : null}
        {updateRequestStatusMutation.isSuccess ? (
          <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Request status update succeeded.
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

function PriorityBadge({ priority }: { priority: MockRequest["priority"] }) {
  if (priority === "High") {
    return <Badge variant="destructive">{priority}</Badge>
  }

  if (priority === "Medium") {
    return <Badge variant="warning">{priority}</Badge>
  }

  return <Badge variant="outline">{priority}</Badge>
}

function RequestStatusUpdateError({ error }: { error: unknown }) {
  const status = error instanceof ApiError ? error.status : null
  const title = status === 403
    ? "403 state"
    : status === 500
      ? "500 state"
      : "Request status update failed"
  const message = error instanceof Error
    ? error.message
    : "Status request gagal diupdate."

  return (
    <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
      <p className="text-sm font-semibold text-rose-950">{title}</p>
      <p className="mt-1 text-sm text-rose-800">{message}</p>
    </div>
  )
}

function formatRequestDate(submittedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(submittedAt))
}
