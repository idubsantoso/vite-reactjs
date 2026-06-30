import type { AuditLog } from "@/mocks/data"

import { apiItemsRequest } from "./client"

type ApiAuditLog = {
  id: string
  actor?: string
  user_name?: string
  name?: string
  action?: string
  description?: string
  target?: string
  resource?: string
  created_at?: string
  createdAt?: string
  updated_at?: string
}

export async function getAuditLogs() {
  const auditLogs = await apiItemsRequest<ApiAuditLog>("/audit-logs")

  return auditLogs.map(mapAuditLog)
}

function mapAuditLog(log: ApiAuditLog): AuditLog {
  return {
    id: log.id,
    actor: log.actor ?? log.user_name ?? log.name ?? "System",
    action: log.action ?? log.description ?? "Updated resource",
    target: log.target ?? log.resource ?? log.id,
    createdAt: log.created_at
      ?? log.createdAt
      ?? log.updated_at
      ?? new Date(0).toISOString(),
  }
}
