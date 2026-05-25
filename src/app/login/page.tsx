import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useAuth } from "./_hooks/use-auth"

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

type LoginFormValues = z.infer<typeof loginSchema>

type LocationState = {
  from?: {
    pathname?: string
  }
}

export default function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAuth()
  const locationState = location.state as LocationState | null
  const redirectPath = locationState?.from?.pathname ?? "/dashboard"

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: LoginFormValues) {
    const user = login(values)

    if (!user) {
      setError("root", {
        message: "Email atau password tidak cocok dengan data user.",
      })
      return
    }

    navigate(redirectPath, { replace: true })
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <header>
          <p className="text-sm font-medium text-slate-500">Backoffice Capstone</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">Login</h1>
          <p className="mt-2 text-sm text-slate-600">
            Silakan login untuk masuk ke backoffice.
          </p>
        </header>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="admin@company.test"
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            ) : null}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Login"}
          </Button>

          {errors.root ? (
            <p className="text-sm text-red-600">{errors.root.message}</p>
          ) : null}
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Login harus menggunakan email dan password dari data user.
        </p>
      </section>
    </main>
  )
}
