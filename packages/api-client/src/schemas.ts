import { z } from "zod";

export const registerUserSchema = z.object({
    username: z.string().min(5, "Username must have at least 5 characters"),
    email: z.email("Invalid e-mail"),
    password: z.string()
        .min(8, "Password needs at least 8 characters")
        .refine((ch) => /[A-Z]/.test(ch), {
            message: "Password must contain at least one uppercase character"
        })
        .refine((ch) => /[a-z]/.test(ch), {
            message: "Passord must contain at least one lowercase character"
        })
        .refine((ch) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch), {
            message: "Password must contain at least one special character"
        }),
});

export const loginUserSchema = z.object ({
    username: z.string().min(1, "Username required"),
    password: z.string().min(1, "Password is required")
});

export type UserSignupInput = z.infer<typeof registerUserSchema>;
export type UserLoginInput = z.infer<typeof loginUserSchema>;