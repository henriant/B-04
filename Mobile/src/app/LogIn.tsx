// Logg inn-felt med brukernavn og passord. Disse sammenlignes med informasjonen som er lagret i databasen (passord hashes) og lar brukeren logge inn dersom de matcher

import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Mail, Lock } from 'lucide-react-native'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import colors from '@/theme'
import { useState } from 'react'
import { router } from 'expo-router'
import { logInSchema } from '@/schemas/auth'
import { AuthInput } from '@/components/shared/AuthInput'
import { authClient } from '@/auth-client'

const LogIn = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [requestError, setRequestError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)


  //Tilsdand for feil
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const handleLogIn = async () => {
    setRequestError(null)
    const result = logInSchema.safeParse({ email, password })

    if (!result.success) {
      const newErrors: { email?: string
        password?: string
      } = {}

      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (field === 'email' || field === 'password') {
          newErrors[field] = issue.message
        }
      }

      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      const { error } = await authClient.signIn.email(result.data)
      if (error) {
        setRequestError(error.message ?? 'Could not log in. Please check your details and try again.')
        return
      }
      router.replace('/Home')
    } catch (cause: unknown) {
      console.error('Log-in failed:', cause)
      setRequestError('Could not log in. Please check your details and try again.')
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
        <Text style={styles.title}>Backlog Defeater</Text>

        <Text style={styles.title}>Log in</Text>

        <Text style={[styles.text, { marginBottom: 20 }]}>Welcome back! Log in to keep tracking your games.</Text>

        <AuthInput
          icon={Mail}
          placeholder='Email'
          keyboardType='email-address'
          autoCapitalize='none'
          value={email}
          onChangeText={(text) => {
            setEmail(text)
            setErrors((prev) => ({...prev, email: undefined}))
          }}
          error={errors.email}
        />

        <AuthInput
          icon={Lock}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text)
            setErrors((prev) => ({...prev, password: undefined}))
          }}
          error={errors.password}

        />

        {requestError ? <Text accessibilityRole="alert" style={styles.error}>{requestError}</Text> : null}
        <Pressable style={styles.button} onPress={() => void handleLogIn()} disabled={isSubmitting}>
          <Text style={styles.text}>{isSubmitting ? 'Logging in...' : 'Log in'}</Text>
        </Pressable>

        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.text}>Don't have an account? </Text>
          <Link href="/SignUp" style={[{ color: colors.wineRed }]}>Sign up</Link>
          
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  safeArea: {
    flex: 1,
    backgroundColor: colors.black,
  },
})

export default LogIn;