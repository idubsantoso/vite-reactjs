import z from "zod"

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Name wajib diisi"),
  description: z.string().trim().optional(),
  isActive: z.boolean(),
})

export type CategoryFormValues = z.infer<typeof categorySchema>