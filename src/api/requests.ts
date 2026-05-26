import type { MockRequest } from "@/mocks/data"

import { apiRequest } from "./client"

export function getRequests() {
  return apiRequest<MockRequest[]>("/api/requests")
}

export function getRequest(id: string) {
  return apiRequest<MockRequest>(`/api/requests/${id}`)
}

export type RequestStatusScenario = "403" | "500"

export function updateRequestStatus(
  id: string,
  status: MockRequest["status"],
  scenario?: RequestStatusScenario,
) {
  const scenarioQuery = scenario ? `?scenario=${scenario}` : ""

  return apiRequest<MockRequest>(`/api/requests/${id}/status${scenarioQuery}`, {
    method: "PATCH",
    body: { status },
    scenarioParam: false,
  })
}
