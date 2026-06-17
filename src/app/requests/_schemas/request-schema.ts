import { z } from "zod"

export const requestPriorityOptions = ["Low", "Medium", "High"] as const
export const requestStatusOptions = ["Active", "Invited", "Suspended"] as const

export const requestSchema = z.object({
  title: z.string().trim().min(1, "Title wajib diisi"),
  requestorName: z.string().trim().min(1, "Requestor wajib dipilih"),
  priority: z.enum(requestPriorityOptions, {
    message: "Priority wajib dipilih",
  }),
  assigneeName: z.string().trim().optional(),
  status: z.enum(requestStatusOptions, {
    message: "Status wajib dipilih",
  }),
})

export type RequestFormValues = z.infer<typeof requestSchema>
