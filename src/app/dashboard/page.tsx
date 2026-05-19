import DashboardSummary from "./_components/dashboard-summary"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-slate-500">Dashboard</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">
          Dashboard Overview
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Ringkasan data utama untuk memantau kondisi backoffice.
        </p>
      </header>

      <DashboardSummary />
    </div>
  )
}
