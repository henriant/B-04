// Hovedsiden, en introduksjon til appen vår, samt en oppfordring til å opprette bruker eller logge inn.

import { Text, StyleSheet, Pressable, FlatList, ScrollView } from 'react-native'
import { useEffect, useState } from 'react'
import { Link } from 'expo-router'
import GameCoverCard from '@/components/gameComponents/GameCoverCard'
import { API_URL } from '@/config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { type IGDBGame } from '@backlog-defeater/api-client'

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
    safeArea: {
        flex: 1,
    },
})

// Fake data for demonstration purposes
/*const fakeGames = [
    { id: 1, name: 'The Witcher 3', total_rating: 93.5 },
    { id: 2, name: 'Hades', total_rating: 90.1 },
    { id: 3, name: 'Celeste', total_rating: 85.7 }
]
*/

const Index = () => {

    const [games, setGames] = useState<IGDBGame[]>([])

    const [loading, setLoading] = useState<boolean>(true)

    const [error, setError] = useState<string | null>(null)

    const loadGames = async () => {
        setLoading(true)
        setError(null)

        try {

            const response = await fetch(`${API_URL}/api/top-games`)

            if (!response.ok) {
                throw new Error("Failed to fetch games: " + response.status)
            }

            const data = await response.json()
            setGames(data)
        }

        catch (error) {
            console.error("Error fetching games:", error)
            setError("Failed to fetch games")
        }

        // kjører uansett om det er en feil eller ikke, for å stoppe loading state
        finally {
            setLoading(false)
        }


    }

    useEffect(() => {

        loadGames()

    }, [])

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Backlog Defeater</Text>
                <Text style={styles.subtitle}>Track your games.</Text>
                <Text style={styles.subtitle}>Discover new worlds!</Text>

                <Link href="/LogIn" asChild>
                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>Log In</Text>
                    </Pressable>
                </Link>

                <Link href="/SignUp" asChild>
                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </Pressable>
                </Link>

                {/* Rendrer loading state mens spillene lastes inn. */}
                {loading && <Text>Loading games...</Text>}

                {/* Rendrer feilmelding dersom det er en feil ved henting av spill. */}
                {error && <Text>{error}</Text>}

                {/* Rendrer spillene dersom alt er ok. */}
                {!loading && !error && (
                    <FlatList style={{ flexGrow: 0 }}
                        data={games}
                        horizontal
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <GameCoverCard game={item} width={130}/>}
                    />
                )}
                
            </ScrollView>
        </SafeAreaView>
    )
}

export default Index