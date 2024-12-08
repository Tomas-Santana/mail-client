import z from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, "Required")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and dashes"
      ),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirm_password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    full_name: z.string().min(1, "Required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const registerResponseSchema = z.object({
  token: z.string(),
  user: registerSchema,
});

export type Register = z.infer<typeof registerSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
