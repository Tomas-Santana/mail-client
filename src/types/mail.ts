import z from "zod"

export const mailSchema = z.object({
  uid: z.string(),
  from: z.string(),
  to: z.array(z.string()),
  subject: z.string(),
  date: z.date(),
  text: z.string(),
  html: z.string(),
  flags: z.array(z.string()),
})

export type Mail = z.infer<typeof mailSchema>