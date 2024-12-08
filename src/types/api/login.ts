import z from "zod";
import { UserSchema } from "../user";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Required")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and dashes"
    ),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});

export type Login = z.infer<typeof loginSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
