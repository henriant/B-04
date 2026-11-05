import { z } from 'zod'

export const logInSchema = z.object({
    email: z.email({error: 'Enter a valid email address'}),
    password: z.string().min(1, {error: 'Password is required' })
})

export const signUpSchema = z.object({
    name: z.string().min(1, { error: 'Enter your name' }),
    email: z.email({error: 'Enter a valid email address' }),
    password: z.string().min(8, {error: 'Password must be at least 8 characters'}),
    confirmPassword: z.string().min(1, {error: 'Confirm your password'})
    
})
.refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
})


export type UserLogInInput = z.infer<typeof logInSchema>
export type UserSignUpInput = z.infer<typeof signUpSchema>