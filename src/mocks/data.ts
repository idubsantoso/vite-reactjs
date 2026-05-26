import type { CurrentUser } from "@/app/login/_types/auth"
import type { User } from "@/app/users/_constants/sample-users"

export type MockRequest = {
  id: string
  title: string
  owner: string
  status: "Pending" | "Approved" | "Rejected"
  priority: "Low" | "Medium" | "High"
  assignee: string
  submittedAt: string
}

export type AuditLog = {
  id: string
  actor: string
  action: string
  target: string
  createdAt: string
}

export const mockUsers: User[] = [
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

export const mockRequests: MockRequest[] = [
  {
    id: "REQ-1001",
    title: "Access approval",
    owner: "Sari Wijaya",
    status: "Pending",
    priority: "High",
    assignee: "Budi Santoso",
    submittedAt: "2026-05-26T02:41:00.000Z",
  },
  {
    id: "REQ-1002",
    title: "Role change",
    owner: "Andi Pratama",
    status: "Approved",
    priority: "Medium",
    assignee: "Sari Wijaya",
    submittedAt: "2026-05-25T09:20:00.000Z",
  },
  {
    id: "REQ-1003",
    title: "Audit export access",
    owner: "Budi Santoso",
    status: "Rejected",
    priority: "Low",
    assignee: "Andi Pratama",
    submittedAt: "2026-05-24T04:12:00.000Z",
  },
]

export const mockAuditLogs: AuditLog[] = [
  {
    id: "AUD-9001",
    actor: "Budi Santoso",
    action: "Updated user role",
    target: "Andi Pratama",
    createdAt: "2026-05-26T02:45:00.000Z",
  },
  {
    id: "AUD-9002",
    actor: "Sari Wijaya",
    action: "Approved access request",
    target: "REQ-1001",
    createdAt: "2026-05-26T01:12:00.000Z",
  },
  {
    id: "AUD-9003",
    actor: "System",
    action: "Exported audit report",
    target: "Audit Logs",
    createdAt: "2026-05-25T11:30:00.000Z",
  },
]

export function toCurrentUser(user: User): CurrentUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}
