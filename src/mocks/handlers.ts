import { delay, http, HttpResponse } from "msw"

import { mockAuditLogs, mockRequests, mockUsers, toCurrentUser } from "./data"
import type { MockRequest } from "./data"

type Scenario = "delay" | "empty" | "401" | "403" | "500"

type UserPayload = {
  name?: string
  email?: string
  password?: string
  role?: "Admin" | "Manager" | "Staff"
  status?: "Active" | "Pending" | "Suspended"
}

type RequestStatusPayload = {
  status?: MockRequest["status"]
}

const MOCK_TOKEN_PREFIX = "mock-token"

export const handlers = [
  http.post("/api/auth/login", async ({ request }) => {
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

    return HttpResponse.json({
      token: createToken(user.id),
      user: toCurrentUser(user),
    })
  }),

  http.get("/api/auth/me", async ({ request }) => {
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

    return HttpResponse.json(toCurrentUser(user))
  }),

  http.get("/api/users", async ({ request }) => {
    await applyMockDelay(request)

    const scenarioResponse = getScenarioResponse(request, {
      emptyData: [],
    })

    if (scenarioResponse) {
      return scenarioResponse
    }

    return HttpResponse.json(mockUsers)
  }),

  http.get("/api/users/:id", async ({ params, request }) => {
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

    return HttpResponse.json(user)
  }),

  http.post("/api/users", async ({ request }) => {
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
      role: payload.role ?? "Staff",
      status: payload.status ?? "Active",
      lastActive: "Never",
    }

    mockUsers.unshift(user)
    addAuditLog("System", "Created user", user.name)

    return HttpResponse.json(user, { status: 201 })
  }),

  http.put("/api/users/:id", async ({ params, request }) => {
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
      role: payload.role ?? mockUsers[userIndex].role,
      status: payload.status ?? mockUsers[userIndex].status,
    }

    mockUsers[userIndex] = updatedUser
    addAuditLog("System", "Updated user", updatedUser.name)

    return HttpResponse.json(updatedUser)
  }),

  http.patch("/api/users/:id/status", async ({ params, request }) => {
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
      status: payload.status ?? mockUsers[userIndex].status,
    }

    mockUsers[userIndex] = updatedUser
    addAuditLog("System", `Updated user status to ${updatedUser.status}`, updatedUser.name)

    return HttpResponse.json(updatedUser)
  }),

  http.get("/api/requests", async ({ request }) => {
    await applyMockDelay(request)

    const scenarioResponse = getScenarioResponse(request, {
      emptyData: [],
    })

    if (scenarioResponse) {
      return scenarioResponse
    }

    return HttpResponse.json(mockRequests)
  }),

  http.get("/api/requests/:id", async ({ params, request }) => {
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

    return HttpResponse.json(mockRequest)
  }),

  http.patch("/api/requests/:id/status", async ({ params, request }) => {
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

    const payload = await request.json() as RequestStatusPayload
    const updatedRequest = {
      ...mockRequests[requestIndex],
      status: payload.status ?? mockRequests[requestIndex].status,
    }

    mockRequests[requestIndex] = updatedRequest
    addAuditLog(
      "System",
      `Updated request status to ${updatedRequest.status}`,
      updatedRequest.id,
    )

    return HttpResponse.json(updatedRequest)
  }),

  http.get("/api/audit-logs", async ({ request }) => {
    await applyMockDelay(request)

    const scenarioResponse = getScenarioResponse(request, {
      emptyData: [],
    })

    if (scenarioResponse) {
      return scenarioResponse
    }

    return HttpResponse.json(mockAuditLogs)
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
