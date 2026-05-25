import type { UserFormValues } from "../_schemas/user-schema"

const SIMPLE_USERS_STORAGE_KEY = "backoffice-capstone-simple-users"

export type UserStatus = UserFormValues["status"]

export type User = {
  id: string
  name: string
  email: string
  password: string
  role: UserFormValues["role"]
  status: UserStatus
  lastActive: string
}

export const sampleUsers: User[] = [
  {
    id: "1",
    name: "Budi Santoso",
    email: "busan@company.test",
    password: "admin123",
    role: "Admin",
    status: "Active",
    lastActive: "Today, 09:41",
  },
  {
    id: "2",
    name: "Sari Wijaya",
    email: "sari.wijaya@company.test",
    password: "sari1234",
    role: "Manager",
    status: "Pending",
    lastActive: "Yesterday, 16:20",
  },
  {
    id: "3",
    name: "Andi Pratama",
    email: "andi.pratama@company.test",
    password: "andi1234",
    role: "Staff",
    status: "Suspended",
    lastActive: "May 17, 2026",
  },
]

export function getSimpleUsers() {
  const storedUsers = localStorage.getItem(SIMPLE_USERS_STORAGE_KEY)

  if (!storedUsers) {
    return sampleUsers
  }

  try {
    const parsedUsers: unknown = JSON.parse(storedUsers)

    if (Array.isArray(parsedUsers)) {
      return parsedUsers as User[]
    }

    return sampleUsers
  } catch {
    return sampleUsers
  }
}

export function saveSimpleUsers(users: User[]) {
  localStorage.setItem(SIMPLE_USERS_STORAGE_KEY, JSON.stringify(users))
}
