import type { AuditLog } from "@/mocks/data"

import { apiRequest } from "./client"

export function getAuditLogs() {
  return apiRequest<AuditLog[]>("/api/audit-logs")
}
