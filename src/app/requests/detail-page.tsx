import { Link, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"

export default function RequestDetailPage() {
  const params = useParams()

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-slate-500">Requests</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">
          Request Detail
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Detail untuk request ID: {params.id}
        </p>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-950">
          Static request detail
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Route detail ini membuktikan `/requests/:id` bisa dibuka langsung
          dan tetap aman saat browser refresh.
        </p>
      </section>

      <Button asChild variant="outline">
        <Link to="/requests">Back to Requests</Link>
      </Button>
    </div>
  )
}
