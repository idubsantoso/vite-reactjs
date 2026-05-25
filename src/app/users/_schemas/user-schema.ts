import { z } from "zod"

export const userRoleOptions = ["Admin", "Manager", "Staff"] as const
export const userStatusOptions = ["Active", "Pending", "Suspended"] as const

export const userSchema = z.object({
  name: z.string().trim().min(1, "Name wajib diisi"),
  email: z.string().trim().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(userRoleOptions, {
    message: "Role wajib dipilih",
  }),
  status: z.enum(userStatusOptions, {
    message: "Status wajib dipilih",
  }),
})

export type UserFormValues = z.infer<typeof userSchema>
