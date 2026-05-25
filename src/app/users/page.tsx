import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { UserForm } from "./_components/user-form"
import UserTable from "./_components/user-table"
import {
  getSimpleUsers,
  saveSimpleUsers,
  type User,
} from "./_constants/sample-users"
import type { UserFormValues } from "./_schemas/user-schema"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(() => getSimpleUsers())
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

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
        <UserTable users={users} onEditUser={setEditingUser} />
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
