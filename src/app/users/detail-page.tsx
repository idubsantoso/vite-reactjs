import { Link, useParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { getSimpleUsers, type UserStatus } from "./_constants/sample-users"

export default function UserDetailPage() {
  const params = useParams()
  const user = getSimpleUsers().find((sampleUser) => sampleUser.id === params.id)

  if (!user) {
    return (
      <div className="space-y-6">
        <header>
          <p className="text-sm font-medium text-slate-500">Users</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">
            User Not Found
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            User dengan ID {params.id} tidak ditemukan.
          </p>
        </header>

        <Button asChild variant="outline">
          <Link to="/users">Back to Users</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-slate-500">Users</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">
          User Detail
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Detail untuk user ID: {user.id}
        </p>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-950">
              {user.name}
            </h3>
            <p className="text-sm text-slate-500">
              {user.email}
            </p>
          </div>
          <StatusBadge status={user.status} />
        </div>
      </section>

      <Button asChild variant="outline">
        <Link to="/users">Back to Users</Link>
      </Button>
    </div>
  )
}

function StatusBadge({ status }: { status: UserStatus }) {
  if (status === "Active") {
    return <Badge variant="success">{status}</Badge>
  }

  if (status === "Pending") {
    return <Badge variant="warning">{status}</Badge>
  }

  return <Badge variant="destructive">{status}</Badge>
}
