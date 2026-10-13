// Logg inn-felt med brukernavn og passord. Disse sammenlignes med informasjonen som er lagret i databasen (passord hashes) og lar brukeren logge inn dersom de matcher

import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Mail, Lock } from 'lucide-react-native'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import colors from '@/theme'
import { useState } from 'react'

const styles = StyleSheet.create({
  container: {
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
  inputIcon: {
    marginRight: 15,
    color: colors.white,
  },
  inputText: {
    color: colors.white,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 10,
    backgroundColor: colors.navyBlue,
  },
})

const LogIn = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        <Image
          source={require('../assets/logo.jpeg')}
          style={{ width: 100, height: 100, marginBottom: 20 }}
        />
        <Text style={styles.title}>Backlog Defeater</Text>

        <Text style={styles.title}>Log in</Text>

        <Text style={[styles.text, {marginBottom: 20}]}>Welcome back! Log in to keep tracking your games.</Text>

        <View style={styles.inputContainer}>
          <Mail style={styles.inputIcon} />
          <TextInput style={styles.inputText}
            placeholder="Email"
            keyboardType='email-address'
            autoCapitalize='none'
            placeholderTextColor='white'
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock style={styles.inputIcon} />
          <TextInput style={styles.inputText}
            placeholder="Password"
            placeholderTextColor='white'
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Pressable style={styles.button}>
          <Text style={styles.text}>Log in</Text>
        </Pressable>

        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.text}>Don't have an account? </Text>
          <Link href="/SignUp" style={[ { color: colors.wineRed }]}>Sign up</Link>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default LogIn;