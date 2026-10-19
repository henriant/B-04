// Siden lar brukeren opprette en ny bruker med brukernavn og passord. Dette blir lagret i databasen vår (passordet hashes), slik at det senere kan brukes til sammenligning når brukeren vil logge inn.

import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Mail, Lock, UserRound } from 'lucide-react-native'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import colors from '@/theme'

const SignUp = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <Image
                    source={require('../assets/logo.jpeg')}
                    style={{ width: 100, height: 100, marginBottom: 20 }} 
                />
                <Text style={styles.title}>Sign up</Text>
                <Text style={styles.text}>Join the community and start your gaming journey today!</Text>

                <View style={styles.inputContainer}>
                    <UserRound style={styles.inputIcon}/>
                    <TextInput style={styles.inputText}
                        placeholder='Name'
                        keyboardType='default'
                        autoCapitalize='none'
                        placeholderTextColor='white'
                    />
                </View>
                
                <View style={styles.inputContainer}>
                    <Mail style={styles.inputIcon} />
                    <TextInput style={styles.inputText}
                        placeholder='Email'
                        keyboardType='email-address'
                        autoCapitalize='none'
                        placeholderTextColor='white'
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Lock style={styles.inputIcon} />
                    <TextInput style={styles.inputText}
                        placeholder='Password'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry
                        placeholderTextColor='white'
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Lock style={styles.inputIcon} />
                    <TextInput style={styles.inputText}
                        placeholder='Confirm password'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry
                        placeholderTextColor='white'
                    />
                </View>

                <Pressable style={styles.button}>
                    <Text style={styles.inputText}>Sign up</Text>
                </Pressable>

                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.text}>Already have an account? </Text>
                    <Link href='/logIn' style={[{color: colors.wineRed}]}>Log in</Link>

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
  button: {
    backgroundColor: colors.wineRed,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '80%',
    alignItems: 'center'
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
  inputText: {
    color: colors.white,
    flex: 1,
  },
  inputIcon: {
    marginRight: 15,
    color: colors.white,
  },
})
/*
const styles = StyleSheet.create({
  inputIcon: {
    marginRight: 15,
    color: colors.white,
  },
  
  
  errorText: {
    width: '80%',
    marginBottom: 10,
    color: colors.errorColor,
  },
})
*/



export default SignUp