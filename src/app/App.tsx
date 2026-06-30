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
import RequestDetailPage from "./requests/detail/page"
import RequestsPage from "./requests/page"
import UserDetailPage from "./users/detail-page"
import UsersPage from "./users/page"
import CategoriesPage from "./category/page"
import EditCategoryPage from "./category/edit/page"
import CreateCategoryPage from "./category/create/page"
import DetailCategoryPage from "./category/detail/page"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:id" element={<DetailCategoryPage />} />
            <Route path="/categories/create" element={<CreateCategoryPage />} />
            <Route path="/categories/:id/edit" element={<EditCategoryPage />} />
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
