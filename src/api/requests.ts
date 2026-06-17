import type { MockRequest } from "@/mocks/data"
import type { RequestFormValues } from "@/app/requests/_schemas/request-schema"

import { apiDataRequest, apiItemsRequest, apiRequest } from "./client"

type ApiRequest = {
  id: string
  title?: string
  name?: string
  requestor_name?: string
  owner?: string
  status?: string
  priority?: string
  assignee_name?: string | null
  assignee?: string | null
  submitted_at?: string
  created_at?: string
  updated_at?: string
}

export async function getRequests() {
  const requests = await apiItemsRequest<ApiRequest>("/requests")

  return requests.map(mapRequest)
}

export async function getRequest(id: string) {
  const data = await apiDataRequest<ApiRequest | { items?: ApiRequest[] }>(
    `/requests/${id}`,
  )

  return mapRequest(getApiRequestFromData(data, id))
}

export async function createRequest(values: RequestFormValues) {
  const data = await apiDataRequest<ApiRequest | { items?: ApiRequest[] }>(
    "/requests",
    {
      method: "POST",
      body: mapRequestPayload(values),
    },
  )

  return mapRequest(getApiRequestFromData(data))
}

export async function updateRequest(id: string, values: RequestFormValues) {
  const data = await apiDataRequest<ApiRequest | { items?: ApiRequest[] }>(
    `/requests/${id}`,
    {
      method: "PATCH",
      body: mapRequestPayload(values),
    },
  )

  return mapRequest(getApiRequestFromData(data, id))
}

export async function deleteRequest(id: string) {
  await apiRequest<void>(`/requests/${id}`, {
    method: "DELETE",
  })
}

function mapRequest(request: ApiRequest): MockRequest {
  return {
    id: request.id,
    title: request.title ?? request.name ?? "Untitled request",
    owner: request.requestor_name ?? request.owner ?? "Unknown",
    status: mapRequestStatusToUi(request.status),
    priority: mapPriorityToUi(request.priority),
    assignee: request.assignee_name ?? request.assignee ?? "Unassigned",
    submittedAt: request.submitted_at
      ?? request.created_at
      ?? request.updated_at
      ?? new Date(0).toISOString(),
  }
}

function mapRequestPayload(values: RequestFormValues) {
  return {
    title: values.title,
    requestor_name: values.requestorName,
    priority: mapPriorityToApi(values.priority),
    assignee_name: values.assigneeName?.trim() ? values.assigneeName.trim() : null,
    status: mapRequestStatusToApi(values.status),
  }
}

function getApiRequestFromData(
  data: ApiRequest | { items?: ApiRequest[] },
  id?: string,
) {
  if ("items" in data) {
    const request = id
      ? data.items?.find((item) => item.id === id)
      : data.items?.[0]

    if (request) {
      return request
    }
  }

  return data as ApiRequest
}

function mapRequestStatusToUi(status: string | undefined): MockRequest["status"] {
  const normalizedStatus = status?.toLowerCase()

  if (normalizedStatus === "invited") {
    return "Invited"
  }

  if (normalizedStatus === "suspended") {
    return "Suspended"
  }

  return "Active"
}

function mapPriorityToUi(priority: string | undefined): MockRequest["priority"] {
  const normalizedPriority = priority?.toLowerCase()

  if (normalizedPriority === "high") {
    return "High"
  }

  if (normalizedPriority === "medium") {
    return "Medium"
  }

  return "Low"
}

function mapPriorityToApi(priority: MockRequest["priority"]) {
  return priority.toLowerCase()
}

function mapRequestStatusToApi(status: MockRequest["status"]) {
  return status.toLowerCase()
}
