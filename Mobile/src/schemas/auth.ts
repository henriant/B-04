import { z } from 'zod'

export const logInSchema = z.object({
    email: z.email().min(1, 'email is required'),
    password: z.string().min(1, 'Password is required')
})

