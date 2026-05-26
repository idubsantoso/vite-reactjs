import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import QueryStateLine from "@/app/_components/query-state-line"

import { useAuditLogsQuery } from "./_hooks/use-audit-logs-query"

export default function AuditLogsPage() {
  const auditLogsQuery = useAuditLogsQuery()
  const auditLogs = auditLogsQuery.data ?? []
  const errorMessage = auditLogsQuery.error instanceof Error
    ? auditLogsQuery.error.message
    : "Audit logs gagal dimuat."

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
        {auditLogsQuery.isLoading ? (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        ) : null}

        {auditLogsQuery.isError ? (
          <article className="rounded-lg border border-rose-200 bg-rose-50 p-6">
            <h3 className="text-base font-semibold text-rose-950">
              Audit logs gagal dimuat
            </h3>
            <p className="mt-2 text-sm text-rose-800">{errorMessage}</p>
            <Button
              type="button"
              variant="destructive"
              className="mt-5"
              onClick={() => void auditLogsQuery.refetch()}
            >
              Reload audit logs
            </Button>
          </article>
        ) : null}

        {auditLogsQuery.isSuccess && auditLogs.length === 0 ? (
          <article className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <h3 className="text-base font-semibold text-slate-950">
              Tidak ada audit log
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
              Mock API mengembalikan data audit logs kosong.
            </p>
            <Button
              type="button"
              className="mt-5"
              onClick={() => void auditLogsQuery.refetch()}
            >
              Reload audit logs
            </Button>
          </article>
        ) : null}

        {auditLogsQuery.isSuccess && auditLogs.length > 0 ? (
          <>
            <QueryStateLine
              label="Audit logs query"
              isFetching={auditLogsQuery.isFetching}
              isStale={auditLogsQuery.isStale}
              onRefresh={() => void auditLogsQuery.refetch()}
            />
            {auditLogs.map((log) => (
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
            ))}
          </>
        ) : null}
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
