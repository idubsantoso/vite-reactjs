import { delay, http, HttpResponse } from "msw"

import { mockAuditLogs, mockRequests, mockUsers, toCurrentUser } from "./data"

type Scenario = "delay" | "empty" | "401" | "403" | "500"

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
