import z from "zod"
import { mailSchema } from "../mail"

export const fetchMailResponseSchema = z.object({
  error: z.string().optional(),
  messages: z.array(mailSchema),
})

export type FetchMailResponse = z.infer<typeof fetchMailResponseSchema>