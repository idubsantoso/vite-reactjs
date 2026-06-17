import { AUTH_TOKEN_STORAGE_KEY } from "@/app/_constants/auth-storage"

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
  scenarioParam?: string | false
}

type ApiErrorPayload = {
  message?: string
  error?: string
  errors?: unknown
}

type ApiEnvelope<T> = {
  status_code?: number
  data?: T
  message?: string
}

const DEFAULT_API_BASE_PATH = "/api/v1"

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
      getErrorMessage(errorPayload),
      response.status,
    )
  }

  return parseJson<T>(response)
}

export async function apiDataRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const payload = await apiRequest<ApiEnvelope<T> | T>(path, options)

  if (isApiEnvelope<T>(payload)) {
    return payload.data as T
  }

  return payload
}

export async function apiItemsRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T[]> {
  const data = await apiDataRequest<{ items?: T[] } | T[]>(path, options)

  if (Array.isArray(data)) {
    return data
  }

  return data.items ?? []
}

function createApiUrl(path: string, scenarioParam: string | false) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const baseUrl = typeof apiBaseUrl === "string" && apiBaseUrl.length > 0
    ? apiBaseUrl
    : `${window.location.origin}${DEFAULT_API_BASE_PATH}`
  const url = new URL(stripLeadingSlash(path), ensureTrailingSlash(baseUrl))
  const scenario = scenarioParam
    ? new URLSearchParams(window.location.search).get(scenarioParam)
    : null

  if (scenario) {
    url.searchParams.set("scenario", scenario)
  }

  return url
}

function ensureTrailingSlash(value: string) {
  return value.endsWith("/") ? value : `${value}/`
}

function stripLeadingSlash(value: string) {
  return value.replace(/^\/+/, "")
}

async function parseJson<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

function isApiEnvelope<T>(payload: ApiEnvelope<T> | T): payload is ApiEnvelope<T> {
  return Boolean(
    payload &&
    typeof payload === "object" &&
    ("data" in payload || "status_code" in payload || "message" in payload),
  )
}

function getErrorMessage(errorPayload: ApiErrorPayload | undefined) {
  if (!errorPayload) {
    return "Request gagal diproses."
  }

  if (errorPayload.message) {
    return errorPayload.message
  }

  if (errorPayload.error) {
    return errorPayload.error
  }

  if (typeof errorPayload.errors === "string") {
    return errorPayload.errors
  }

  return "Request gagal diproses."
}
