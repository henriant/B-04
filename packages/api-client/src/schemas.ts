import { z } from "zod";

export const registerUserSchema = z.object({
    name: z.string().min(1, "Name is required").max(20, "Name must be 20 characters or fewer"),
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
    email: z.email("Invalid e-mail"),
    password: z.string().min(1, "Password is required")
});

export const igdbGameSchema = z.object({
    id: z.number(),
    name: z.string(),
    coverImageId: z.string().optional(),
    summary: z.string().optional(),
    firstReleaseDate: z.number().optional(),
    publisher: z.string().optional(),
});

export const libraryStatusSchema = z.enum([
    "planned",
    "playing",
    "completed"
]);

export const libraryEntrySchema = z.object({
    igdbGameId: z.number(),
    status: libraryStatusSchema,
    addedAt: z.string(),
    game: igdbGameSchema.optional()
});

export type UserSignupInput = z.infer<typeof registerUserSchema>;
export type UserLoginInput = z.infer<typeof loginUserSchema>;