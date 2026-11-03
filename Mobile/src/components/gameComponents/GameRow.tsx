import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { ChevronRight } from 'lucide-react-native'
import { igdbImageUrl, type IGDBGame } from '@backlog-defeater/api-client'
import colors from '@/theme'

type Props = {
    game: IGDBGame
}

const GameRow = ({ game }: Props) => (
    <Link href={{ pathname: '/GameInfo', params: { id: game.id } }} asChild>
        <Pressable>
            <View style={styles.row}>
                <Image
                    source={igdbImageUrl(game.coverImageId)}
                    style={styles.cover}
                    contentFit="cover"
                />
                <Text style={styles.title}>{game.name}</Text>
                <ChevronRight color={colors.muted} />
            </View>
        </Pressable>
    </Link>
)

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    cover: {
        width: 60,
        aspectRatio: 3 / 4,
        borderRadius: 6,
    },
    title: {
        color: colors.white,
        flex: 1,
    },
})

export default GameRow