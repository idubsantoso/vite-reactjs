import { AUTH_TOKEN_STORAGE_KEY } from "@/app/_constants/auth-storage"

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
  scenarioParam?: string | false
}

type ApiErrorPayload = {
  message?: string
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, headers, scenarioParam = "scenario", ...requestOptions } = options
  const url = createApiUrl(path, scenarioParam)
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  const requestHeaders = new Headers(headers)

  requestHeaders.set("Accept", "application/json")

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json")
  }

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(url, {
    ...requestOptions,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    const errorPayload = await parseJson<ApiErrorPayload>(response)
    throw new ApiError(
      errorPayload?.message ?? "Request gagal diproses.",
      response.status,
    )
  }

  return parseJson<T>(response)
}

function createApiUrl(path: string, scenarioParam: string | false) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const baseUrl = typeof apiBaseUrl === "string" && apiBaseUrl.length > 0
    ? apiBaseUrl
    : window.location.origin
  const url = new URL(path, baseUrl)
  const scenario = scenarioParam
    ? new URLSearchParams(window.location.search).get(scenarioParam)
    : null

  if (scenario) {
    url.searchParams.set("scenario", scenario)
  }

  return url
}

async function parseJson<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
