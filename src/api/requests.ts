import type { MockRequest } from "@/mocks/data"

import { apiRequest } from "./client"

export function getRequests() {
  return apiRequest<MockRequest[]>("/api/requests")
}

export function getRequest(id: string) {
  return apiRequest<MockRequest>(`/api/requests/${id}`)
}

export function updateRequestStatus(id: string, status: MockRequest["status"]) {
  return apiRequest<MockRequest>(`/api/requests/${id}/status`, {
    method: "PATCH",
    body: { status },
  })
}
