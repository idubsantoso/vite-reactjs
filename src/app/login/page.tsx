import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <header>
          <p className="text-sm font-medium text-slate-500">
            Backoffice Capstone
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">
            Login
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Login behavior dibuat terpisah dari authenticated app shell.
          </p>
        </header>

        <form className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input id="email" type="email" placeholder="admin@company.test" />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Input id="password" type="password" placeholder="Password" />
          </div>

          <Button asChild className="mt-2">
            <Link to="/dashboard">Login</Link>
          </Button>
        </form>
      </section>
    </main>
  )
}
