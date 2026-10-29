// Viser full informasjon om ett spill, etter at brukeren klikker på spillet (enten i listen eller på et gameCard)

import { getTestGameById } from '@/data/testGames'
import { type IGDBGame } from '@backlog-defeater/api-client'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text } from 'react-native'

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


    return (
        <View>
            <Text>GameInfo</Text>
        </View>
    )
}

export default GameInfo