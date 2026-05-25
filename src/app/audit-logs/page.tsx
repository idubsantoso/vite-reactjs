import { useEffect, useState } from "react"

import { getAuditLogs } from "@/api/audit-logs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { AuditLog } from "@/mocks/data"

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAuditLogs()
  }, [])

  async function loadAuditLogs() {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const apiAuditLogs = await getAuditLogs()
      setAuditLogs(apiAuditLogs)
    } catch (error) {
      setAuditLogs([])
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Audit logs gagal dimuat.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-slate-500">Audit Logs</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">
          Audit Logs
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Aktivitas penting backoffice untuk kebutuhan monitoring.
        </p>
      </header>

      <section className="space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        ) : null}

        {!isLoading && errorMessage ? (
          <article className="rounded-lg border border-rose-200 bg-rose-50 p-6">
            <h3 className="text-base font-semibold text-rose-950">
              Audit logs gagal dimuat
            </h3>
            <p className="mt-2 text-sm text-rose-800">{errorMessage}</p>
            <Button
              type="button"
              variant="destructive"
              className="mt-5"
              onClick={loadAuditLogs}
            >
              Reload audit logs
            </Button>
          </article>
        ) : null}

        {!isLoading && !errorMessage && auditLogs.length === 0 ? (
          <article className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <h3 className="text-base font-semibold text-slate-950">
              Tidak ada audit log
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
              Mock API mengembalikan data audit logs kosong.
            </p>
            <Button type="button" className="mt-5" onClick={loadAuditLogs}>
              Reload audit logs
            </Button>
          </article>
        ) : null}

        {!isLoading && !errorMessage ? auditLogs.map((log) => (
          <article
            key={log.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="text-sm font-medium text-slate-950">
                {log.actor} {log.action}
              </p>
              <p className="mt-1 text-sm text-slate-500">{log.target}</p>
            </div>
            <Badge variant="outline">
              {formatAuditDate(log.createdAt)}
            </Badge>
          </article>
        )) : null}
      </section>
    </div>
  )
}

function formatAuditDate(createdAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(createdAt))
}
