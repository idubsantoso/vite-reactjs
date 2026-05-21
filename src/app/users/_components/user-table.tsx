import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, Pencil } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  sampleUsers,
  type User,
  type UserStatus,
} from "../_constants/sample-users"
import EmptyState from "./empty-state"
import ErrorState from "./error-state"

type UserTableProps = {
  users?: User[]
  onEditUser?: (user: User) => void
}

function getStatusClassName(status: UserStatus) {
  if (status === "Active") {
    return "success"
  }

  if (status === "Pending") {
    return "warning"
  }

  return "destructive"
}

export default function UserTable({
  users = sampleUsers,
  onEditUser,
}: UserTableProps) {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")

  const normalizedKeyword = searchKeyword.toLowerCase().trim()
  const shouldShowError = normalizedKeyword === "error"

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(normalizedKeyword) ||
      user.email.toLowerCase().includes(normalizedKeyword) ||
      user.role.toLowerCase().includes(normalizedKeyword)

    const matchesStatus =
      selectedStatus === "All" || user.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  function resetSearch() {
    setSearchKeyword("")
    setSelectedStatus("All")
  }

  return (
    <section
      aria-labelledby="static-table-title"
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="static-table-title"
            className="text-base font-semibold text-slate-950"
          >
            Static Table
          </h2>
          <p className="text-sm text-slate-500">
            Cari user berdasarkan nama, email, role, atau status.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="user-search">
            Search users
          </label>
          <Input
            id="user-search"
            type="search"
            value={searchKeyword}
            placeholder="Search users"
            className="sm:w-64"
            onChange={(event) => setSearchKeyword(event.target.value)}
          />

          <label className="sr-only" htmlFor="user-status-filter">
            Filter users by status
          </label>
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger
              id="user-status-filter"
              className="sm:w-40"
              aria-label="Filter users by status"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {shouldShowError && (
        <div className="p-5">
          <ErrorState onButtonClick={resetSearch} />
        </div>
      )}

      {!shouldShowError && filteredUsers.length === 0 && (
        <div className="p-5">
          <EmptyState onButtonClick={resetSearch} />
        </div>
      )}

      {!shouldShowError && filteredUsers.length > 0 && (
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead scope="col">Name</TableHead>
              <TableHead scope="col">Password</TableHead>
              <TableHead scope="col">Role</TableHead>
              <TableHead scope="col">Status</TableHead>
              <TableHead scope="col">Last Active</TableHead>
              <TableHead scope="col" className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.email}>
                <TableCell className="whitespace-nowrap">
                  <Link
                    to={`/users/${user.id}`}
                    className="text-sm font-medium text-slate-950 hover:underline"
                  >
                      {user.name}
                  </Link>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </TableCell>
                <TableCell className="whitespace-nowrap font-mono text-sm">
                  {user.password}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {user.role}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <StatusBadge status={user.status} />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {user.lastActive}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild size="icon" variant="outline">
                      <Link to={`/users/${user.id}`} aria-label={`Detail ${user.name}`}>
                        <Eye className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      aria-label={`Edit ${user.name}`}
                      onClick={() => onEditUser?.(user)}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  )
}

function StatusBadge({ status }: { status: UserStatus }) {
  const statusClassName = getStatusClassName(status)

  if (statusClassName === "success") {
    return <Badge variant="success">{status}</Badge>
  }

  if (statusClassName === "warning") {
    return <Badge variant="warning">{status}</Badge>
  }

  return <Badge variant="destructive">{status}</Badge>
}
