import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { User } from "@/app/users/_constants/sample-users"

import {
  requestPriorityOptions,
  requestSchema,
  requestStatusOptions,
  type RequestFormValues,
} from "../_schemas/request-schema"

type RequestFormProps = {
  defaultValues?: RequestFormValues
  mode?: "create" | "edit"
  users: User[]
  isUsersLoading?: boolean
  usersError?: unknown
  onSubmit: (values: RequestFormValues) => Promise<void> | void
}

const emptyRequestValues: RequestFormValues = {
  title: "",
  requestorName: "",
  priority: "Low",
  assigneeName: "",
  status: "Active",
}

export function RequestForm({
  defaultValues,
  mode = "create",
  users,
  isUsersLoading = false,
  usersError,
  onSubmit,
}: RequestFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: defaultValues ?? emptyRequestValues,
  })
  const hasUsersError = Boolean(usersError)
  const isRequestorDisabled = isUsersLoading || hasUsersError || users.length === 0

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-2 md:col-span-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="title">
          Title
        </label>
        <Input id="title" {...register("title")} />
        {errors.title ? (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="requestorName"
        >
          Requestor
        </label>
        <Controller
          control={control}
          name="requestorName"
          render={({ field }) => (
            <Select
              value={field.value}
              disabled={isRequestorDisabled}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id="requestorName"
                aria-invalid={Boolean(errors.requestorName)}
              >
                <SelectValue
                  placeholder={isUsersLoading ? "Loading users" : "Pilih requestor"}
                />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.name}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {hasUsersError ? (
          <p className="text-sm text-red-600">Data users gagal dimuat.</p>
        ) : null}
        {!isUsersLoading && !hasUsersError && users.length === 0 ? (
          <p className="text-sm text-red-600">User belum tersedia.</p>
        ) : null}
        {errors.requestorName ? (
          <p className="text-sm text-red-600">{errors.requestorName.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="priority">
          Priority
        </label>
        <Controller
          control={control}
          name="priority"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="priority" aria-invalid={Boolean(errors.priority)}>
                <SelectValue placeholder="Pilih priority" />
              </SelectTrigger>
              <SelectContent>
                {requestPriorityOptions.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.priority ? (
          <p className="text-sm text-red-600">{errors.priority.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="assigneeName"
        >
          Assignee
        </label>
        <Input
          id="assigneeName"
          placeholder="Optional"
          {...register("assigneeName")}
        />
        {errors.assigneeName ? (
          <p className="text-sm text-red-600">{errors.assigneeName.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="status">
          Status
        </label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="status" aria-invalid={Boolean(errors.status)}>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                {requestStatusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.status ? (
          <p className="text-sm text-red-600">{errors.status.message}</p>
        ) : null}
      </div>

      <div className="flex justify-end md:col-span-2">
        <Button type="submit" disabled={isSubmitting || isRequestorDisabled}>
          {isSubmitting
            ? "Saving..."
            : mode === "edit"
              ? "Update Request"
              : "Create Request"}
        </Button>
      </div>
    </form>
  )
}
