import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export default function ForbiddenPage() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-medium text-slate-500">403</p>
      <h2 className="mt-1 text-2xl font-semibold text-slate-950">
        Forbidden
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        User tidak memiliki permission untuk membuka halaman ini.
      </p>
      <Button asChild className="mt-5">
        <Link to="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  )
}
