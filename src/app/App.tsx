import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom"

import MainLayout from "./_components/main-layout"
import ProtectedRoute from "./_components/protected-route"
import AuditLogsPage from "./audit-logs/page"
import DashboardPage from "./dashboard/page"
import ForbiddenPage from "./forbidden-page"
import LoginPage from "./login/page"
import NotFoundPage from "./not-found-page"
import RequestDetailPage from "./requests/detail-page"
import RequestsPage from "./requests/page"
import UserDetailPage from "./users/detail-page"
import UsersPage from "./users/page"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserDetailPage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/requests/:id" element={<RequestDetailPage />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
