import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { getRequests } from "@/api/requests"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { MockRequest } from "@/mocks/data"

export default function RequestsPage() {
  const [requests, setRequests] = useState<MockRequest[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const apiRequests = await getRequests()
      setRequests(apiRequests)
    } catch (error) {
      setRequests([])
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Data requests gagal dimuat.",
      )
    } finally {
      setIsLoading(false)
    }
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

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : null}

      {!isLoading && errorMessage ? (
        <section className="rounded-lg border border-rose-200 bg-rose-50 p-6">
          <h3 className="text-base font-semibold text-rose-950">
            Requests gagal dimuat
          </h3>
          <p className="mt-2 text-sm text-rose-800">{errorMessage}</p>
          <Button
            type="button"
            variant="destructive"
            className="mt-5"
            onClick={loadRequests}
          >
            Reload requests
          </Button>
        </section>
      ) : null}

      {!isLoading && !errorMessage && requests.length === 0 ? (
        <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <h3 className="text-base font-semibold text-slate-950">
            Tidak ada request
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
            Mock API mengembalikan data requests kosong.
          </p>
          <Button type="button" className="mt-5" onClick={loadRequests}>
            Reload requests
          </Button>
        </section>
      ) : null}

      {!isLoading && !errorMessage && requests.length > 0 ? (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Request</TableHead>
              <TableHead scope="col">Owner</TableHead>
              <TableHead scope="col">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Link
                    to={`/requests/${request.id}`}
                    className="font-medium text-slate-950 hover:underline"
                  >
                    {request.id}
                  </Link>
                  <p className="text-sm text-slate-500">{request.title}</p>
                </TableCell>
                <TableCell>{request.owner}</TableCell>
                <TableCell>
                  <RequestStatusBadge status={request.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      ) : null}
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
