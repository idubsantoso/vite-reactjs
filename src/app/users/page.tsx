import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ApiErrorState from "@/app/_components/api-error-state"
import { useApiAuthRedirect } from "@/app/_hooks/use-api-auth-redirect"
import QueryStateLine from "@/app/_components/query-state-line"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { UserForm } from "./_components/user-form"
import EmptyState from "./_components/empty-state"
import UserTable from "./_components/user-table"
import type { User } from "./_constants/sample-users"
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
} from "./_hooks/use-user-mutations"
import { useUsersQuery } from "./_hooks/use-users-query"
import type { UserFormValues } from "./_schemas/user-schema"

export default function UsersPage() {
  const usersQuery = useUsersQuery()
  const createUserMutation = useCreateUserMutation()
  const updateUserMutation = useUpdateUserMutation()
  const updateUserStatusMutation = useUpdateUserStatusMutation()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const users = usersQuery.data ?? []
  useApiAuthRedirect(usersQuery.error)
  useApiAuthRedirect(createUserMutation.error)
  useApiAuthRedirect(updateUserMutation.error)
  useApiAuthRedirect(updateUserStatusMutation.error)

  async function handleCreateUser(values: UserFormValues) {
    await createUserMutation.mutateAsync(values)
    setIsCreateDialogOpen(false)
  }

  async function handleUpdateUser(values: UserFormValues) {
    if (!editingUser) {
      return
    }

    await updateUserMutation.mutateAsync({ id: editingUser.id, values })
    setEditingUser(null)
  }

  function handleUpdateUserStatus(user: User, status: User["status"]) {
    updateUserStatusMutation.mutate({ id: user.id, status })
  }

  const updatingStatusUserId = updateUserStatusMutation.isPending
    ? updateUserStatusMutation.variables?.id
    : undefined

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button type="button" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Create User
        </Button>
      </div>

      <section>
        {usersQuery.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
        ) : null}

        {usersQuery.isError ? (
          <ApiErrorState
            error={usersQuery.error}
            fallbackMessage="Data users gagal dimuat."
            onRetry={() => void usersQuery.refetch()}
          />
        ) : null}

        {usersQuery.isSuccess && users.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <EmptyState
              description="Mock API mengembalikan data users kosong."
              buttonLabel="Reload users"
              onButtonClick={() => void usersQuery.refetch()}
            />
          </div>
        ) : null}

        {usersQuery.isSuccess && users.length > 0 ? (
          <div className="space-y-3">
            <QueryStateLine
              label="Users query"
              isFetching={usersQuery.isFetching}
              isStale={usersQuery.isStale}
              onRefresh={() => void usersQuery.refetch()}
            />
            <UserTable
              users={users}
              updatingStatusUserId={updatingStatusUserId}
              onEditUser={setEditingUser}
              onUpdateUserStatus={handleUpdateUserStatus}
            />
          </div>
        ) : null}
      </section>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              Tambahkan user baru ke data tabel.
            </DialogDescription>
          </DialogHeader>
          <UserForm onSubmit={handleCreateUser} />
          {createUserMutation.isError ? (
            <p className="text-sm text-red-600">
              {getErrorMessage(createUserMutation.error, "User gagal dibuat.")}
            </p>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editingUser)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingUser(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update data user dari baris yang dipilih.
            </DialogDescription>
          </DialogHeader>
          {editingUser ? (
            <UserForm
              key={editingUser.id}
              mode="edit"
              defaultValues={{
                name: editingUser.name,
                email: editingUser.email,
                password: editingUser.password,
                role: editingUser.role,
                status: editingUser.status,
              }}
              onSubmit={handleUpdateUser}
            />
          ) : null}
          {updateUserMutation.isError ? (
            <p className="text-sm text-red-600">
              {getErrorMessage(updateUserMutation.error, "User gagal diupdate.")}
            </p>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}
