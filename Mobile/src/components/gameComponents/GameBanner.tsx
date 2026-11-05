// Banner som viser et og et spill i karusell

import colors from "@/theme";
import { type IGDBGame, igdbImageUrl } from "@backlog-defeater/api-client";
import { Link } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";


type GameBannerProps = {
    game: IGDBGame
    width: number
}

const GameBannerCard = ({ game, width }: GameBannerProps) => {

    //Til sjekk om spillet har bilde
    const imageUrl = igdbImageUrl(game.coverImageId);

    return (

        <View style={{ width, paddingHorizontal: 5 }}>
            <Link href={{ pathname: '/GameInfo', params: { id: game.id } }} asChild>
                <Pressable style={styles.banner}>
                    {imageUrl !== '' && (
                        <Image
                            source={{ uri: imageUrl }}
                            style={StyleSheet.absoluteFill}
                            contentFit="cover"
                        />
                    )}
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>
                            {game.name}
                        </Text>
                    </View>
                </Pressable>
            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    banner: {
        height: 180,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: colors.navyBlue,
        justifyContent: 'flex-end',
    },
    titleContainer: {
        backgroundColor: '#191f4585',
        padding: 8,
    },
    title: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
})

export default GameBannerCard;