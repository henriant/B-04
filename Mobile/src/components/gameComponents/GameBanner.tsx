// Banner som viser et og et spill i karusell

import colors from "@/theme"
import { type Game } from "@/types/game"
import { Link } from "expo-router"
import { View, Text, Pressable, StyleSheet } from "react-native"

type GameBannerProps = {
    game: Game
    width: number
}

const GameBanner = ({ game, width }: GameBannerProps) => {
    return (

        <View style={{ width, paddingHorizontal: 5 }}>
            <View style={styles.bannerContainer}>
                <Text style={styles.title}>Title: {game.name}</Text>
                <Text style={styles.rating}>Total rating: {game.total_rating}</Text>

                <Link href='/GameInfo' asChild>
                    <Pressable>
                        <Text>Mer info-knapp</Text>
                    </Pressable>
                </Link>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    bannerContainer: {
        padding: 10,
        backgroundColor: colors.white,
        borderRadius: 5,
        margin: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    rating: {
        fontSize: 16,
    },
})

export default GameBanner;