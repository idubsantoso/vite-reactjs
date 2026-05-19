import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

const auditLogs = [
  "Admin updated user role",
  "Manager approved access request",
  "System exported audit report",
]

export default function AuditLogsPage() {
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
        {auditLogs.map((log) => (
          <article
            key={log}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-950">{log}</p>
            <Badge variant="outline">Today</Badge>
          </article>
        ))}

        <Skeleton className="h-16 w-full" />
      </section>
    </div>
  )
}
