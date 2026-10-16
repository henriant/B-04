import { z } from 'zod'

export const logInSchema = z.object({
    email: z.email({error: 'Enter a valif email address'}),
    password: z.string().min(1, 'Password is required')
})
