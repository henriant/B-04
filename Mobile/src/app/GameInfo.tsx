// Viser full informasjon om ett spill, etter at brukeren klikker på spillet (enten i listen eller på et gameCard)

import { getTestGameById } from '@/data/testGames'
import colors from '@/theme'
import { igdbImageUrl, type IGDBGame } from '@backlog-defeater/api-client'
import { Image } from 'expo-image'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const GameInfo = () => {

    const { id } = useLocalSearchParams<{ id: string }>()

    const [game, setGame] = useState<IGDBGame | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isCancelled = false;

        setLoading(true);
        setError(null);

        getTestGameById(Number(id))
            .then((result) => {
                if (!isCancelled) {
                    setGame(result)
                }
            })
            .catch((err) => {
                if (!isCancelled) {
                    console.error("Failed to load game", err)
                    setError("Something went wrong. Please try again")
                }
            })
            .finally(() => {
                if (!isCancelled) {
                    setLoading(false)
                }
            })


        return () => { isCancelled = true }
    }, [id])

    //Tilstandsmeldinger
    const renderContent = () => {
        if (loading) {
            return <Text style={styles.message}>Loading...</Text>
        }
        if (error) {
            return <Text style={styles.message}>{error}</Text>
        }
        if (game === null) {
            return <Text style={styles.message}>Game not found</Text>
        }
        return (
            <View style={styles.header}>
                <Image
                source={igdbImageUrl(game.coverImageId)}
                style={styles.cover}
                contentFit='cover'
                />
                <Text style={styles.title}>{game.name}</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {renderContent()}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.black
    },
    cover: {
        width: 110,
        aspectRatio: 3 / 4,
        borderRadius: 6,
    },
    header: {
        flexDirection: 'row',
        gap: 12,
    },
    title: {
        color: colors.white,
        flex: 1,
        fontSize: 18
    },
    message: {
        color: colors.white,
        textAlign: 'center',
        padding: 5
    },
    container: {
        paddingHorizontal: 15,
        paddingVertical: 8,
    }
})

export default GameInfo