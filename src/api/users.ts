import type { User } from "@/app/users/_constants/sample-users"
import type { UserFormValues } from "@/app/users/_schemas/user-schema"

import { apiDataRequest, apiItemsRequest } from "./client"

type ApiUser = {
  id: string
  name: string
  email: string
  password?: string
  role: string
  status: string
  created_at?: string
  updated_at?: string
}

export async function getUsers() {
  const users = await apiItemsRequest<ApiUser>("/users")

  return users.map(mapUser)
}

export async function getUser(id: string) {
  const data = await apiDataRequest<ApiUser | { items?: ApiUser[] }>(
    `/users/${id}`,
  )

  return mapUser(getApiUserFromData(data, id))
}

export async function createUser(values: UserFormValues) {
  const data = await apiDataRequest<ApiUser | { items?: ApiUser[] }>("/users", {
    method: "POST",
    body: mapUserPayload(values),
  })

  return mapUser(getApiUserFromData(data))
}

export async function updateUser(id: string, values: UserFormValues) {
  const data = await apiDataRequest<ApiUser | { items?: ApiUser[] }>(
    `/users/${id}`,
    {
      method: "PATCH",
      body: mapUserPayload(values),
    },
  )

  return mapUser(getApiUserFromData(data, id))
}

export async function updateUserStatus(id: string, status: User["status"]) {
  const data = await apiDataRequest<ApiUser | { items?: ApiUser[] }>(
    `/users/${id}`,
    {
      method: "PATCH",
      body: { status: mapUserStatusToApi(status) },
    },
  )

  return mapUser(getApiUserFromData(data, id))
}

function mapUser(user: ApiUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password ?? "",
    role: mapUserRoleToUi(user.role),
    status: mapUserStatusToUi(user.status),
    lastActive: formatLastActive(user.updated_at ?? user.created_at),
  }
}

function mapUserPayload(values: UserFormValues) {
  return {
    name: values.name,
    email: values.email,
    password: values.password,
    role: mapUserRoleToApi(values.role),
    status: mapUserStatusToApi(values.status),
  }
}

function getApiUserFromData(data: ApiUser | { items?: ApiUser[] }, id?: string) {
  if ("items" in data) {
    const user = id
      ? data.items?.find((item) => item.id === id)
      : data.items?.[0]

    if (user) {
      return user
    }
  }

  return data as ApiUser
}

function mapUserRoleToUi(role: string): User["role"] {
  const normalizedRole = role.toLowerCase()

  if (normalizedRole === "admin") {
    return "Admin"
  }

  if (normalizedRole === "manager") {
    return "Manager"
  }

  return "Staff"
}

function mapUserRoleToApi(role: User["role"]) {
  if (role === "Admin") {
    return "admin"
  }

  if (role === "Manager") {
    return "manager"
  }

  return "viewer"
}

function mapUserStatusToUi(status: string): User["status"] {
  const normalizedStatus = status.toLowerCase()

  if (normalizedStatus === "pending") {
    return "Pending"
  }

  if (normalizedStatus === "suspended") {
    return "Suspended"
  }

  return "Active"
}

function mapUserStatusToApi(status: User["status"]) {
  return status.toLowerCase()
}

function formatLastActive(value: string | undefined) {
  if (!value) {
    return "Never"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}
