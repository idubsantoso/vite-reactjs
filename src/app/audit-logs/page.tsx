import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ApiErrorState from "@/app/_components/api-error-state"
import { useApiAuthRedirect } from "@/app/_hooks/use-api-auth-redirect"
import QueryStateLine from "@/app/_components/query-state-line"

import AuditLogsTable from "./_components/audit-logs-table"
import { useAuditLogsQuery } from "./_hooks/use-audit-logs-query"

export default function AuditLogsPage() {
  const auditLogsQuery = useAuditLogsQuery()
  const auditLogs = auditLogsQuery.data ?? []
  useApiAuthRedirect(auditLogsQuery.error)

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
          <ApiErrorState
            error={auditLogsQuery.error}
            fallbackMessage="Audit logs gagal dimuat."
            onRetry={() => void auditLogsQuery.refetch()}
          />
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
            <AuditLogsTable auditLogs={auditLogs} />
          </>
        ) : null}
      </section>
    </div>
  )
}
