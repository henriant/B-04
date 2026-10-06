// Hovedsiden, en introduksjon til appen vår, samt en oppfordring til å opprette bruker eller logge inn.

import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
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
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
})

const Index = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Backlog Defeater</Text>
            <Text style={styles.subtitle}>Track your games.</Text>
            <Text style={styles.subtitle}>Discover new worlds!</Text>

            <Link href="/logIn" asChild>
                <Pressable style={styles.button}>
                    <Text style={styles.buttonText}>Log In</Text>
                </Pressable>
            </Link>

            <Link href="/signUp" asChild>
                <Pressable style={styles.button}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </Pressable>
            </Link>
        </View>
    )
}

export default Index