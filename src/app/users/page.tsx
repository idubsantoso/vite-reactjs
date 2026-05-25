import { useEffect, useState } from "react"
import { Plus } from "lucide-react"

import { getUsers } from "@/api/users"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { UserForm } from "./_components/user-form"
import EmptyState from "./_components/empty-state"
import ErrorState from "./_components/error-state"
import UserTable from "./_components/user-table"
import { saveSimpleUsers, type User } from "./_constants/sample-users"
import type { UserFormValues } from "./_schemas/user-schema"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const apiUsers = await getUsers()
      setUsers(apiUsers)
      saveSimpleUsers(apiUsers)
    } catch (error) {
      setUsers([])
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Data users gagal dimuat.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  function handleCreateUser(values: UserFormValues) {
    const newUser: User = {
      id: crypto.randomUUID(),
      lastActive: "Never",
      ...values,
    }

    setUsers((currentUsers) => {
      const nextUsers = [newUser, ...currentUsers]
      saveSimpleUsers(nextUsers)
      return nextUsers
    })
    setIsCreateDialogOpen(false)
  }

  function handleUpdateUser(values: UserFormValues) {
    if (!editingUser) {
      return
    }

    setUsers((currentUsers) => {
      const nextUsers = currentUsers.map((user) =>
        user.id === editingUser.id ? { ...user, ...values } : user,
      )

      saveSimpleUsers(nextUsers)
      return nextUsers
    })
    setEditingUser(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button type="button" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Create User
        </Button>
      </div>

      <section>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <ErrorState
              description={errorMessage}
              buttonLabel="Reload users"
              onButtonClick={loadUsers}
            />
          </div>
        ) : null}

        {!isLoading && !errorMessage && users.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <EmptyState
              description="Mock API mengembalikan data users kosong."
              buttonLabel="Reload users"
              onButtonClick={loadUsers}
            />
          </div>
        ) : null}

        {!isLoading && !errorMessage && users.length > 0 ? (
          <UserTable users={users} onEditUser={setEditingUser} />
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
        </DialogContent>
      </Dialog>
    </div>
  )
}
