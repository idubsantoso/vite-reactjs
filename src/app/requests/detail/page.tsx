import { Link, useParams } from "react-router-dom"
import type { ComponentProps } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ApiErrorState from "@/app/_components/api-error-state"
import QueryStateLine from "@/app/_components/query-state-line"
import type { MockRequest } from "@/mocks/data"

import { useRequestQuery } from "./_hooks/use-request-query"

type BadgeVariant = ComponentProps<typeof Badge>["variant"]

const statusVariants: Partial<Record<MockRequest["status"], BadgeVariant>> = {
  Active: "success",
  Suspended: "destructive",
}

const priorityVariants: Partial<Record<MockRequest["priority"], BadgeVariant>> = {
  High: "destructive",
  Medium: "warning",
}

export default function RequestDetailPage() {
  const params = useParams()
  const requestQuery = useRequestQuery(params.id)
  const request = requestQuery.data

  if (requestQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (requestQuery.isError) {
    return (
      <div className="space-y-6">
        <header>
          <p className="text-sm font-medium text-slate-500">Requests</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">
            Request Detail
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Request detail tidak bisa dimuat.
          </p>
        </header>

        <ApiErrorState
          error={requestQuery.error}
          fallbackMessage="Request detail gagal dimuat."
          onRetry={() => void requestQuery.refetch()}
        />
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
          </div>
        </div>
      </section>

      <Button asChild variant="outline">
        <Link to="/requests">Back to Requests</Link>
      </Button>
    </div>
  )
}

function RequestStatusBadge({ status }: { status: MockRequest["status"] }) {
  return <Badge variant={statusVariants[status] || "warning"}>{status}</Badge>
}

function PriorityBadge({ priority }: { priority: MockRequest["priority"] }) {
  return (
    <Badge variant={priorityVariants[priority] || "outline"}>
      {priority}
    </Badge>
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
