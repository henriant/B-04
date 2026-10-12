// Logg inn-felt med brukernavn og passord. Disse sammenlignes med informasjonen som er lagret i databasen (passord hashes) og lar brukeren logge inn dersom de matcher

import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Mail, Lock } from 'lucide-react-native'
import { Image } from 'expo-image'
import { Link } from 'expo-router'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
})

const LogIn = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>

        <Image
          source={require('../assets/logo.jpeg')}
          style={{ width: 100, height: 100, marginBottom: 20 }}
        />

        <Text style={styles.title}>Backlog Defeater</Text>

        <Text>Welcome back! Log in to keep tracking your games.</Text>

        <View style={{ flexDirection: 'row' }}>
          <Mail />
          <TextInput
            placeholder="Email"
            style={{ borderWidth: 1, borderColor: 'gray', padding: 10, width: '80%', marginBottom: 10 }}
          />
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Lock />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={{ borderWidth: 1, borderColor: 'gray', padding: 10, width: '80%', marginBottom: 10 }}
          />
        </View>

        <Pressable style={styles.button}>
          <Text>Log in</Text>
        </Pressable>

        <View style={{ flexDirection: 'row' }}>
          <Text>Don't have an account? </Text>
          <Link href="/SignUp" style={{ color: 'blue' }}>
            <Pressable>
              <Text style={{ color: 'blue' }}>Sign up</Text>
            </Pressable>
          </Link>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default LogIn;