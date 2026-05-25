import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useAuth } from "../login/_hooks/use-auth"

type NavigationItem = {
  label: string
  path: string
}

const navigationItems: NavigationItem[] = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Users", path: "/users" },
  { label: "Requests", path: "/requests" },
  { label: "Audit Logs", path: "/audit-logs" },
]

export default function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const activePath = getActivePath(location.pathname)

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <span className="text-base font-semibold">Backoffice</span>
        </div>

        <nav className="space-y-1 px-3 py-4" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                getNavigationClassName(isActive || activePath === item.path)
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Backoffice Capstone
              </p>
              <h1 className="text-lg font-semibold text-slate-950">
                {getPageTitle(activePath)}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <label className="sr-only" htmlFor="mobile-menu">
                Choose menu
              </label>
              <Select
                value={activePath}
                onValueChange={(path) => navigate(path)}
              >
                <SelectTrigger
                  id="mobile-menu"
                  className="w-36 lg:hidden"
                  aria-label="Choose menu"
                >
                  <SelectValue placeholder="Menu" />
                </SelectTrigger>
                <SelectContent>
                  {navigationItems.map((item) => (
                    <SelectItem key={item.path} value={item.path}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button type="button" variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function getNavigationClassName(isActive: boolean) {
  if (isActive) {
    return "block rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white"
  }

  return "block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
}

function getActivePath(pathname: string) {
  if (pathname.startsWith("/users")) {
    return "/users"
  }

  if (pathname.startsWith("/requests")) {
    return "/requests"
  }

  if (pathname.startsWith("/audit-logs")) {
    return "/audit-logs"
  }

  return "/dashboard"
}

function getPageTitle(activePath: string) {
  const activeItem = navigationItems.find((item) => item.path === activePath)

  if (activeItem) {
    return activeItem.label
  }

  return "Dashboard"
}
