import { Link, useParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function UserDetailPage() {
  const params = useParams()

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-slate-500">Users</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">
          User Detail
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Detail untuk user ID: {params.id}
        </p>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-950">
              Budi Santoso
            </h3>
            <p className="text-sm text-slate-500">
              budi.santoso@company.test
            </p>
          </div>
          <Badge variant="success">Active</Badge>
        </div>
      </section>

      <Button asChild variant="outline">
        <Link to="/users">Back to Users</Link>
      </Button>
    </div>
  )
}
