import z from "zod";

export const UserSchema = z.object({
  username: z.string(),
  full_name: z.string(),
});

export type User = z.infer<typeof UserSchema>;