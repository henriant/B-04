// Logg inn-felt med brukernavn og passord. Disse sammenlignes med informasjonen som er lagret i databasen (passord hashes) og lar brukeren logge inn dersom de matcher

import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

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
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
    </View>
  )
}

export default LogIn;