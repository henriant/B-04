// Siden lar brukeren opprette en ny bruker med brukernavn og passord. Dette blir lagret i databasen vår (passordet hashes), slik at det senere kan brukes til sammenligning når brukeren vil logge inn.

import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Mail, Lock, UserRound } from 'lucide-react-native'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import colors from '@/theme'
import { useState } from 'react'
import { router } from 'expo-router'
import { ApiError } from '@backlog-defeater/api-client'
import { apiClient } from '@/api'
import { signUpSchema, type UserSignUpInput } from '@/schemas/auth'
import { AuthInput } from '@/components/shared/AuthInput'

const SignUp = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [requestError, setRequestError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    //tilstand for feil
    const [errors, setErrors] = useState<Partial<Record<keyof UserSignUpInput, string>>>({})

    const handleSignUp = async () => {
        setRequestError(null)
        const result = signUpSchema.safeParse({ name, email, password, confirmPassword })

        if (!result.success) {
            const newErrors: Partial<Record<keyof UserSignUpInput, string>> = {}

            for (const issue of result.error.issues) {
                const field = issue.path[0]
                if (field === 'name' || field === 'email' || field === 'password' || field === 'confirmPassword') {
                    newErrors[field] ??= issue.message
                }
            }

            setErrors(newErrors)
            return
        }

        setErrors({})
        setIsSubmitting(true)
        try {
            await apiClient.register({
                name: result.data.name,
                email: result.data.email,
                password: result.data.password,
            })
            router.replace('/Home')
        } catch (cause: unknown) {
            console.error('Sign-up failed:', cause)
            setRequestError(
                cause instanceof ApiError
                    ? cause.message
                    : 'Could not create your account. Please try again.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <Image
                    source={require('../assets/logo.jpeg')}
                    style={{ width: 100, height: 100, marginBottom: 20 }}
                />
                <Text style={styles.title}>Sign up</Text>
                <Text style={styles.text}>Join the community and start your gaming journey today!</Text>

                <AuthInput
                    icon={UserRound}
                    placeholder='Name'
                    keyboardType='default'
                    value={name}
                    onChangeText={(text) => {
                        setName(text)
                        setErrors((prev) => ({ ...prev, name: undefined }))
                    }}
                    error={errors.name}
                />


                <AuthInput
                    icon={Mail}
                    placeholder='Email'
                    keyboardType='email-address'
                    autoCapitalize='none'
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text)
                        setErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                    error={errors.email}
                />

                <AuthInput
                    icon={Lock}
                    placeholder='Password'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text)
                        setErrors((prev) => ({ ...prev, password: undefined, confirmPassword: undefined }))
                    }}
                    error={errors.password}
                />

                <AuthInput
                    icon={Lock}
                    placeholder='Confirm password'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={(text) => {
                        setConfirmPassword(text)
                        setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                    }}
                    error={errors.confirmPassword}
                />

                {requestError ? <Text accessibilityRole="alert" style={styles.error}>{requestError}</Text> : null}
                <Pressable style={styles.button} onPress={() => void handleSignUp()} disabled={isSubmitting}>
                    <Text style={styles.text}>{isSubmitting ? 'Signing up...' : 'Sign up'}</Text>
                </Pressable>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.text}>Already have an account? </Text>
                    <Link href='/LogIn' style={[{ color: colors.wineRed }]}>Log in</Link>

                </View>

            </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    safeArea: {
        flex: 1,
        backgroundColor: colors.black
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colors.white
    },
    text: {
        color: colors.white
    },
    error: { color: colors.errorColor, marginTop: 10, textAlign: 'center', paddingHorizontal: 20 },
    button: {
        backgroundColor: colors.wineRed,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '80%',
        alignItems: 'center'
    },
})



export default SignUp
