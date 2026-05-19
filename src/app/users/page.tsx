import UserTable from "./_components/user-table"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-slate-500">Users</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">
          User Table
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Halaman ini fokus untuk menampilkan data users, pencarian, empty
          state, dan error state.
        </p>
      </header>

      <section>
        <UserTable />
      </section>
    </div>
  )
}
