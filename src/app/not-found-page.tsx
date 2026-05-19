import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-500">404</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-950">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Route yang diminta tidak tersedia.
        </p>
        <Button asChild className="mt-5">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </section>
    </main>
  )
}
