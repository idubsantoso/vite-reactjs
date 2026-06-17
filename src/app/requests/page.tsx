import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ApiErrorState from "@/app/_components/api-error-state"
import { useApiAuthRedirect } from "@/app/_hooks/use-api-auth-redirect"
import QueryStateLine from "@/app/_components/query-state-line"
import type { MockRequest } from "@/mocks/data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUsersQuery } from "@/app/users/_hooks/use-users-query"

import { RequestForm } from "./_components/request-form"
import RequestsTable from "./_components/requests-table"
import {
  useCreateRequestMutation,
  useDeleteRequestMutation,
  useUpdateRequestMutation,
} from "./_hooks/use-request-mutations"
import { useRequestsQuery } from "./_hooks/use-requests-query"
import type { RequestFormValues } from "./_schemas/request-schema"

export default function RequestsPage() {
  const requestsQuery = useRequestsQuery()
  const usersQuery = useUsersQuery()
  const createRequestMutation = useCreateRequestMutation()
  const updateRequestMutation = useUpdateRequestMutation()
  const deleteRequestMutation = useDeleteRequestMutation()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState<MockRequest | null>(null)
  const [deletingRequest, setDeletingRequest] = useState<MockRequest | null>(null)
  const requests = requestsQuery.data ?? []
  const users = usersQuery.data ?? []
  useApiAuthRedirect(requestsQuery.error)
  useApiAuthRedirect(usersQuery.error)
  useApiAuthRedirect(createRequestMutation.error)
  useApiAuthRedirect(updateRequestMutation.error)
  useApiAuthRedirect(deleteRequestMutation.error)
  const pendingDeleteRequestId = deleteRequestMutation.isPending
    ? deleteRequestMutation.variables
    : undefined

  async function handleCreateRequest(values: RequestFormValues) {
    await createRequestMutation.mutateAsync(values)
    setIsCreateDialogOpen(false)
  }

  async function handleUpdateRequest(values: RequestFormValues) {
    if (!editingRequest) {
      return
    }

    await updateRequestMutation.mutateAsync({
      id: editingRequest.id,
      values,
    })
    setEditingRequest(null)
  }

  async function handleDeleteRequest() {
    if (!deletingRequest) {
      return
    }

    await deleteRequestMutation.mutateAsync(deletingRequest.id)
    setDeletingRequest(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <header>
          <p className="text-sm font-medium text-slate-500">Requests</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">
            Request List
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Semua request bisa dibuka ke route detail.
          </p>
        </header>

        <Button type="button" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Create Request
        </Button>
      </div>

      {requestsQuery.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : null}

      {requestsQuery.isError ? (
        <ApiErrorState
          error={requestsQuery.error}
          fallbackMessage="Data requests gagal dimuat."
          onRetry={() => void requestsQuery.refetch()}
        />
      ) : null}

      {requestsQuery.isSuccess && requests.length === 0 ? (
        <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <h3 className="text-base font-semibold text-slate-950">
            Tidak ada request
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
            Mock API mengembalikan data requests kosong.
          </p>
          <Button
            type="button"
            className="mt-5"
            onClick={() => void requestsQuery.refetch()}
          >
            Reload requests
          </Button>
        </section>
      ) : null}

      {requestsQuery.isSuccess && requests.length > 0 ? (
        <div className="space-y-3">
          <QueryStateLine
            label="Requests query"
            isFetching={requestsQuery.isFetching}
            isStale={requestsQuery.isStale}
            onRefresh={() => void requestsQuery.refetch()}
          />
          {deleteRequestMutation.isError ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {getErrorMessage(deleteRequestMutation.error, "Request gagal dihapus.")}
            </p>
          ) : null}
          <RequestsTable
            requests={requests}
            pendingDeleteRequestId={pendingDeleteRequestId}
            onEditRequest={setEditingRequest}
            onDeleteRequest={setDeletingRequest}
          />
        </div>
      ) : null}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Request</DialogTitle>
            <DialogDescription>
              Tambahkan request baru dan pilih requestor dari data users.
            </DialogDescription>
          </DialogHeader>
          <RequestForm
            users={users}
            isUsersLoading={usersQuery.isLoading}
            usersError={usersQuery.error}
            onSubmit={handleCreateRequest}
          />
          {createRequestMutation.isError ? (
            <p className="text-sm text-red-600">
              {getErrorMessage(createRequestMutation.error, "Request gagal dibuat.")}
            </p>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editingRequest)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingRequest(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Request</DialogTitle>
            <DialogDescription>
              Update data request yang dipilih.
            </DialogDescription>
          </DialogHeader>
          {editingRequest ? (
            <RequestForm
              key={editingRequest.id}
              mode="edit"
              users={users}
              isUsersLoading={usersQuery.isLoading}
              usersError={usersQuery.error}
              defaultValues={{
                title: editingRequest.title,
                requestorName: editingRequest.owner,
                priority: editingRequest.priority,
                assigneeName: editingRequest.assignee,
                status: editingRequest.status,
              }}
              onSubmit={handleUpdateRequest}
            />
          ) : null}
          {updateRequestMutation.isError ? (
            <p className="text-sm text-red-600">
              {getErrorMessage(updateRequestMutation.error, "Request gagal diupdate.")}
            </p>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deletingRequest)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingRequest(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Request</DialogTitle>
            <DialogDescription>
              Request {deletingRequest?.id} akan dihapus permanen.
            </DialogDescription>
          </DialogHeader>
          {deleteRequestMutation.isError ? (
            <p className="text-sm text-red-600">
              {getErrorMessage(deleteRequestMutation.error, "Request gagal dihapus.")}
            </p>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={deleteRequestMutation.isPending}
              onClick={() => setDeletingRequest(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteRequestMutation.isPending}
              onClick={() => void handleDeleteRequest()}
            >
              {deleteRequestMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}
