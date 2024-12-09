import z from "zod";

export const sendEmailSchema = z.object({
  emails: z.array(z.string().email("Some recipients are not valid")).min(1, "To is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

export type SendEmail = z.infer<typeof sendEmailSchema> & {reply_to?: string};

export const sendEmailResponseSchema = z.object({
  "message": z.string(),
});

export type SendEmailResponse = z.infer<typeof sendEmailResponseSchema>;