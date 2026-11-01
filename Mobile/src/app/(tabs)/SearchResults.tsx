// Viser alle spillene som matcher søkefilter som brukeren skriver i søkefeltet Search.tsx. Disse kan klikkes på for å vise GameInfo.tsx for det spesifikke spillet.

import { igdbImageUrl, type IGDBGame } from '@backlog-defeater/api-client'
import { View, Text, TextInput, StyleSheet, FlatList, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { searchTestGames } from '@/data/testGames'
import colors from '@/theme'
import { Image } from 'expo-image'
import { Link } from 'expo-router'



const SearchResults = () => {

    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<IGDBGame[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false;

        setLoading(true);
        setError(null);

        searchTestGames(query)
            .then((games) => {
                if (!isCancelled) {
                    setResults(games);
                }
            })
            .catch((err) => {
                if (!isCancelled) {
                    console.error("Search failed:", err);
                    setError('Something went wrong. Please try again')
                }
            })
            .finally(() => {
                if (!isCancelled) {
                    setLoading(false);
                }
            })

        return () => { isCancelled = true }
    }, [query])

    const renderStatus = () => {
        if (query.trim() === '') {
            return <Text style={styles.message}>Search for a game</Text>
        }
        if (error) {
            return <Text style={styles.message}>{error}</Text>
        }
        if (loading) {
            return <Text style={styles.message}>Searching...</Text>
        }
        if (results.length === 0) {
            return <Text style={styles.message}>No results</Text>
        }
        return (
            <FlatList
                data={results}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <Link href={{ pathname: '/GameInfo', params: { id: item.id } }} asChild>
                        <Pressable>
                            <View style={styles.row}>
                                <Image
                                    source={igdbImageUrl(item.coverImageId)}
                                    style={styles.cover}
                                    contentFit='cover'
                                />
                                <Text style={styles.title}>{item.name}</Text>
                            </View>
                        </Pressable>
                    </Link>
                )}
            />
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={{ padding: 15 }}>
                <TextInput style={styles.inputText}
                    placeholder='Search for a game..'
                    placeholderTextColor='#fcfcfc58'
                    value={query}
                    onChangeText={setQuery}
                />
            </View>

            {renderStatus()}


        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.black
    },
    inputText: {
        color: colors.white,
        backgroundColor: colors.navyBlue,
        padding: 10,
        borderRadius: 10
    },
    message: {
        color: colors.white,
        textAlign: 'center',
        padding: 5
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 15,
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


export default SearchResults