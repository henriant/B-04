import { igdbImageUrl, type IGDBGame } from "@backlog-defeater/api-client";
import { Image } from "expo-image";
import { View, Text, StyleSheet } from "react-native";
import colors from "@/theme";


type GameCoverCardProps = {
    game: IGDBGame,
    width: number
};

const GameCoverCard = ({ game, width }: GameCoverCardProps) => {

    const imageUrl = igdbImageUrl(game.coverImageId);
    
    return(
        <View style={[styles.card, { width }]}>
            {imageUrl !== '' && (
                <Image
                    source={{ uri: imageUrl}}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                />
            )}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{game.name}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        aspectRatio: 3 / 4,
        borderRadius: 12,
        overflow: 'hidden',            // klipper bildet til de rundede hjørnene
        backgroundColor: colors.navyBlue,
        justifyContent: 'flex-end',    // legger tittelen nederst
    },
    titleContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 8,
    },
    title: {
        color: colors.white,
        fontWeight: 'bold',
    },
})

export default GameCoverCard;
/*

export type IGDBGame = {
    id: number;
    name: string;
    coverImageId?: string;
    summary?: string;
    firstReleaseDate?: number;
};


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
*/