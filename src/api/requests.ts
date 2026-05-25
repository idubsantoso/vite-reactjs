import type { MockRequest } from "@/mocks/data"

import { apiRequest } from "./client"

export function getRequests() {
  return apiRequest<MockRequest[]>("/api/requests")
}

export function getRequest(id: string) {
  return apiRequest<MockRequest>(`/api/requests/${id}`)
}
