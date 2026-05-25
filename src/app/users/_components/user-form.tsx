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
import {
  userSchema,
  userRoleOptions,
  userStatusOptions,
  type UserFormValues,
} from "../_schemas/user-schema"

type UserFormProps = {
  defaultValues?: UserFormValues
  mode?: "create" | "edit"
  onSubmit: (values: UserFormValues) => Promise<void> | void
}

const emptyUserValues: UserFormValues = {
  name: "",
  email: "",
  password: "",
  role: "Staff",
  status: "Active",
}

export function UserForm({
  defaultValues,
  mode = "create",
  onSubmit,
}: UserFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues ?? emptyUserValues,
  })

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="name">
          Name
        </label>
        <Input id="name" {...register("name")} />
        {errors.name ? (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email ? (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="password"
        >
          Password
        </label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password ? (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="role">
          Role
        </label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="role" aria-invalid={Boolean(errors.role)}>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                {userRoleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.role ? (
          <p className="text-sm text-red-600">{errors.role.message}</p>
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
                {userStatusOptions.map((status) => (
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "edit"
              ? "Update User"
              : "Create User"}
        </Button>
      </div>
    </form>
  )
}
