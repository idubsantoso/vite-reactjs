import { delay, http, HttpResponse } from "msw"

import { mockAuditLogs, mockRequests, mockUsers } from "./data"
import type { MockRequest } from "./data"

type Scenario = "delay" | "empty" | "401" | "403" | "500"

type UserPayload = {
  name?: string
  email?: string
  password?: string
  role?: string
  status?: string
}

type RequestPayload = {
  title?: string
  requestor_name?: string
  priority?: string
  assignee_name?: string | null
  status?: string
}

const MOCK_TOKEN_PREFIX = "mock-token"

export const handlers = [
  http.post("/api/v1/auth/login", async ({ request }) => {
    await applyMockDelay(request)

    const scenarioResponse = getScenarioResponse(request)

    if (scenarioResponse) {
      return scenarioResponse
    }

    const credentials = await request.json() as {
      email?: string
      password?: string
    }
    const user = mockUsers.find(
      (mockUser) =>
        mockUser.email === credentials.email &&
        mockUser.password === credentials.password,
    )

    if (!user) {
      return HttpResponse.json(
        { message: "Email atau password tidak cocok dengan data user." },
        { status: 401 },
      )
    }

    return HttpResponse.json(createApiResponse({
      ...toApiUser(user),
      access_token: createToken(user.id),
      access_token_expired_at: new Date(Date.now() + 86400000).toISOString(),
    }, "Login By Password successfully"))
  }),

  http.get("/api/v1/auth/me", async ({ request }) => {
    await applyMockDelay(request)

    const scenarioResponse = getScenarioResponse(request)

    if (scenarioResponse) {
      return scenarioResponse
    }

    const user = getUserFromRequest(request)

    if (!user) {
      return HttpResponse.json(
        { message: "Sesi login tidak ditemukan." },
        { status: 401 },
      )
    }

    return HttpResponse.json(createApiResponse(toApiUser(user)))
  }),

  http.get("/api/v1/users", async ({ request }) => {
    await applyMockDelay(request)

    const scenarioResponse = getScenarioResponse(request, {
      emptyData: [],
    })

    if (scenarioResponse) {
      return scenarioResponse
    }

    return HttpResponse.json(createPaginatedResponse(mockUsers.map(toApiUser)))
  }),

  http.get("/api/v1/users/:id", async ({ params, request }) => {
    await applyMockDelay(request)

    const scenarioResponse = getScenarioResponse(request)

    if (scenarioResponse) {
      return scenarioResponse
    }

    const user = mockUsers.find((mockUser) => mockUser.id === params.id)

    if (!user) {
      return HttpResponse.json(
        { message: "User tidak ditemukan." },
        { status: 404 },
      )
    }

    return HttpResponse.json(createApiResponse(toApiUser(user)))
  }),

  http.post("/api/v1/users", async ({ request }) => {
    await applyMockDelay(request)

    const scenarioResponse = getScenarioResponse(request)

    if (scenarioResponse) {
      return scenarioResponse
    }

    const payload = await request.json() as UserPayload
    const user = {
      id: crypto.randomUUID(),
      name: payload.name ?? "",
      email: payload.email ?? "",
      password: payload.password ?? "",
      role: mapApiRoleToMockRole(payload.role),
      status: mapApiStatusToMockStatus(payload.status),
      lastActive: "Never",
    }

    mockUsers.unshift(user)
    addAuditLog("System", "Created user", user.name)

    return HttpResponse.json(createApiResponse(toApiUser(user), "User created"), {
      status: 201,
    })
  }),

  http.patch("/api/v1/users/:id", async ({ params, request }) => {
    await applyMockDelay(request)

    const scenarioResponse = getScenarioResponse(request)

    if (scenarioResponse) {
      return scenarioResponse
    }

    const userIndex = mockUsers.findIndex((mockUser) => mockUser.id === params.id)

    if (userIndex === -1) {
      return HttpResponse.json(
        { message: "User tidak ditemukan." },
        { status: 404 },
      )
    }

    const payload = await request.json() as UserPayload
    const updatedUser = {
      ...mockUsers[userIndex],
      name: payload.name ?? mockUsers[userIndex].name,
      email: payload.email ?? mockUsers[userIndex].email,
      password: payload.password ?? mockUsers[userIndex].password,
      role: mapApiRoleToMockRole(payload.role, mockUsers[userIndex].role),
      status: mapApiStatusToMockStatus(payload.status, mockUsers[userIndex].status),
    }

    mockUsers[userIndex] = updatedUser
    addAuditLog("System", "Updated user", updatedUser.name)

    return HttpResponse.json(createApiResponse(toApiUser(updatedUser)))
  }),

  http.get("/api/v1/requests", async ({ request }) => {
    await applyMockDelay(request)

    const scenarioResponse = getScenarioResponse(request, {
      emptyData: [],
    })

    if (scenarioResponse) {
      return scenarioResponse
    }

    return HttpResponse.json(createPaginatedResponse(mockRequests.map(toApiRequest)))
  }),

  http.get("/api/v1/requests/:id", async ({ params, request }) => {
    await applyMockDelay(request)

    const scenarioResponse = getScenarioResponse(request)

    if (scenarioResponse) {
      return scenarioResponse
    }

    const mockRequest = mockRequests.find((requestItem) => requestItem.id === params.id)

    if (!mockRequest) {
      return HttpResponse.json(
        { message: "Request tidak ditemukan." },
        { status: 404 },
      )
    }

    return HttpResponse.json(createApiResponse(toApiRequest(mockRequest)))
  }),

  http.post("/api/v1/requests", async ({ request }) => {
    await applyMockDelay(request)

    const scenarioResponse = getScenarioResponse(request)

    if (scenarioResponse) {
      return scenarioResponse
    }

    const payload = await request.json() as RequestPayload
    const mockRequest: MockRequest = {
      id: `REQ-${Date.now()}`,
      title: payload.title ?? "",
      owner: payload.requestor_name ?? "Unknown",
      status: mapApiRequestStatusToMockStatus(payload.status, "Active"),
      priority: mapApiPriorityToMockPriority(payload.priority),
      assignee: payload.assignee_name ?? "Unassigned",
      submittedAt: new Date().toISOString(),
    }

    mockRequests.unshift(mockRequest)
    addAuditLog("System", "Created request", mockRequest.id)

    return HttpResponse.json(createApiResponse(toApiRequest(mockRequest), "Request created"), {
      status: 201,
    })
  }),

  http.patch("/api/v1/requests/:id", async ({ params, request }) => {
    await applyMockDelay(request)

    const scenarioResponse = getScenarioResponse(request)

    if (scenarioResponse) {
      return scenarioResponse
    }

    const requestIndex = mockRequests.findIndex(
      (requestItem) => requestItem.id === params.id,
    )

    if (requestIndex === -1) {
      return HttpResponse.json(
        { message: "Request tidak ditemukan." },
        { status: 404 },
      )
    }

    const payload = await request.json() as RequestPayload
    const updatedRequest = {
      ...mockRequests[requestIndex],
      title: payload.title ?? mockRequests[requestIndex].title,
      owner: payload.requestor_name ?? mockRequests[requestIndex].owner,
      priority: payload.priority
        ? mapApiPriorityToMockPriority(payload.priority)
        : mockRequests[requestIndex].priority,
      assignee: payload.assignee_name ?? mockRequests[requestIndex].assignee,
      status: mapApiRequestStatusToMockStatus(
        payload.status,
        mockRequests[requestIndex].status,
      ),
    }

    mockRequests[requestIndex] = updatedRequest
    addAuditLog(
      "System",
      `Updated request status to ${updatedRequest.status}`,
      updatedRequest.id,
    )

    return HttpResponse.json(createApiResponse(toApiRequest(updatedRequest)))
  }),

  http.delete("/api/v1/requests/:id", async ({ params, request }) => {
    await applyMockDelay(request)

    const scenarioResponse = getScenarioResponse(request)

    if (scenarioResponse) {
      return scenarioResponse
    }

    const requestIndex = mockRequests.findIndex(
      (requestItem) => requestItem.id === params.id,
    )

    if (requestIndex === -1) {
      return HttpResponse.json(
        { message: "Request tidak ditemukan." },
        { status: 404 },
      )
    }

    const [deletedRequest] = mockRequests.splice(requestIndex, 1)
    addAuditLog("System", "Deleted request", deletedRequest.id)

    return new HttpResponse(null, { status: 204 })
  }),

  http.get("/api/v1/audit-logs", async ({ request }) => {
    await applyMockDelay(request)

    const scenarioResponse = getScenarioResponse(request, {
      emptyData: [],
    })

    if (scenarioResponse) {
      return scenarioResponse
    }

    return HttpResponse.json(createPaginatedResponse(mockAuditLogs.map(toApiAuditLog)))
  }),
]

async function applyMockDelay(request: Request) {
  const scenario = getScenario(request)

  if (scenario === "delay") {
    await delay(1800)
    return
  }

  await delay(getRealisticDelay())
}

function getScenarioResponse(
  request: Request,
  options: { emptyData?: [] } = {},
) {
  const scenario = getScenario(request)

  if (scenario === "empty" && "emptyData" in options) {
    return HttpResponse.json(options.emptyData)
  }

  if (scenario === "401") {
    return HttpResponse.json(
      { message: "Anda perlu login untuk mengakses data ini." },
      { status: 401 },
    )
  }

  if (scenario === "403") {
    return HttpResponse.json(
      { message: "Anda tidak memiliki akses ke resource ini." },
      { status: 403 },
    )
  }

  if (scenario === "500") {
    return HttpResponse.json(
      { message: "Server mock sedang mengalami gangguan." },
      { status: 500 },
    )
  }

  return null
}

function getScenario(request: Request): Scenario | null {
  const scenario = new URL(request.url).searchParams.get("scenario")

  if (
    scenario === "delay" ||
    scenario === "empty" ||
    scenario === "401" ||
    scenario === "403" ||
    scenario === "500"
  ) {
    return scenario
  }

  return null
}

function getRealisticDelay() {
  return Math.floor(Math.random() * 551) + 350
}

function createToken(userId: string) {
  return `${MOCK_TOKEN_PREFIX}:${userId}`
}

function getUserFromRequest(request: Request) {
  const authorization = request.headers.get("Authorization")
  const token = authorization?.replace("Bearer ", "")
  const userId = token?.startsWith(`${MOCK_TOKEN_PREFIX}:`)
    ? token.replace(`${MOCK_TOKEN_PREFIX}:`, "")
    : null

  return mockUsers.find((user) => user.id === userId) ?? null
}

function addAuditLog(actor: string, action: string, target: string) {
  mockAuditLogs.unshift({
    id: `AUD-${Date.now()}`,
    actor,
    action,
    target,
    createdAt: new Date().toISOString(),
  })
}

function createApiResponse<T>(data: T, message = "Success", statusCode = 200) {
  return {
    status_code: statusCode,
    data,
    message,
  }
}

function createPaginatedResponse<T>(items: T[]) {
  return createApiResponse({
    meta: {
      total_all_data: items.length,
      total_view: items.length,
      max_view: 20,
      current_page: 1,
      total_page: items.length > 0 ? 1 : 0,
    },
    items,
  })
}

function toApiUser(user: (typeof mockUsers)[number]) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    role: mapMockRoleToApiRole(user.role),
    status: user.status.toLowerCase(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

function toApiRequest(request: MockRequest) {
  return {
    id: request.id,
    title: request.title,
    requestor_name: request.owner,
    status: request.status.toLowerCase(),
    priority: request.priority.toLowerCase(),
    assignee_name: request.assignee,
    created_at: request.submittedAt,
    updated_at: request.submittedAt,
  }
}

function toApiAuditLog(log: (typeof mockAuditLogs)[number]) {
  return {
    id: log.id,
    actor: log.actor,
    action: log.action,
    target: log.target,
    created_at: log.createdAt,
  }
}

function mapMockRoleToApiRole(role: (typeof mockUsers)[number]["role"]) {
  if (role === "Admin") {
    return "admin"
  }

  if (role === "Manager") {
    return "manager"
  }

  return "viewer"
}

function mapApiRoleToMockRole(
  role: string | undefined,
  fallback: (typeof mockUsers)[number]["role"] = "Staff",
) {
  if (role === "admin") {
    return "Admin"
  }

  if (role === "manager") {
    return "Manager"
  }

  if (role === "viewer" || role === "staff") {
    return "Staff"
  }

  return fallback
}

function mapApiStatusToMockStatus(
  status: string | undefined,
  fallback: (typeof mockUsers)[number]["status"] = "Active",
) {
  if (status === "pending") {
    return "Pending"
  }

  if (status === "suspended") {
    return "Suspended"
  }

  if (status === "active") {
    return "Active"
  }

  return fallback
}

function mapApiRequestStatusToMockStatus(
  status: string | undefined,
  fallback: MockRequest["status"],
) {
  if (status === "invited") {
    return "Invited"
  }

  if (status === "suspended") {
    return "Suspended"
  }

  if (status === "active") {
    return "Active"
  }

  return fallback
}

function mapApiPriorityToMockPriority(
  priority: string | undefined,
): MockRequest["priority"] {
  if (priority === "high") {
    return "High"
  }

  if (priority === "medium") {
    return "Medium"
  }

  return "Low"
}
