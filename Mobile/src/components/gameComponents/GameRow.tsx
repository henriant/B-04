import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { ChevronRight } from 'lucide-react-native'
import { igdbImageUrl, type IGDBGame } from '@backlog-defeater/api-client'
import colors from '@/theme'
import type { LibraryStatus } from '@backlog-defeater/api-client'

type Props = {
    game: IGDBGame
    status?: LibraryStatus
}

const GameRow = ({ game, status }: Props) => (
    <Link href={{ pathname: '/GameInfo', params: { id: game.id } }} asChild>
        <Pressable>
            <View style={styles.row}>
                <Image
                    source={igdbImageUrl(game.coverImageId)}
                    style={styles.cover}
                    contentFit="cover"
                />
                <View style={styles.details}>
                    <Text style={styles.title}>{game.name}</Text>
                    {status ? <Text style={styles.status}>In library · {status}</Text> : null}
                </View>
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
    },
    details: { flex: 1 },
    status: { color: colors.muted, fontSize: 12, marginTop: 3 },
})

export default GameRow