import { igdbImageUrl, type IGDBGame } from "@backlog-defeater/api-client";
import { Image } from "expo-image";
import { View, Text, StyleSheet, Pressable } from "react-native";
import colors from "@/theme";
import { Link } from "expo-router";


type GameCoverCardProps = {
    game: IGDBGame,
    width: number
};

const GameCoverCard = ({ game, width }: GameCoverCardProps) => {

    const imageUrl = igdbImageUrl(game.coverImageId);

    return (
        <Link href={{ pathname: '/GameInfo', params: { id: game.id } }} asChild style={[styles.card, { width }]}>
            <Pressable>
                {imageUrl !== '' && (
                    <Image
                        source={{ uri: imageUrl }}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                    />
                )}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{game.name}</Text>
                </View>
            </Pressable>
        </Link>
    )
}

const styles = StyleSheet.create({
    card: {
        aspectRatio: 3 / 4,
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
        fontWeight: 'bold',
    },
})

export default GameCoverCard;