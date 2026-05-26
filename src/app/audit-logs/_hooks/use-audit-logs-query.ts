import { useQuery } from "@tanstack/react-query"

import { getAuditLogs } from "@/api/audit-logs"

export const auditLogsQueryKeys = {
  all: ["audit-logs"] as const,
  lists: () => [...auditLogsQueryKeys.all, "list"] as const,
}

export function useAuditLogsQuery() {
  return useQuery({
    queryKey: auditLogsQueryKeys.lists(),
    queryFn: getAuditLogs,
  })
}
