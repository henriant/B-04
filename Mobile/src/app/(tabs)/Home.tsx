import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import colors from '@/theme';
import GameCoverCard from '@/components/gameComponents/GameCoverCard';
import { type LibraryEntry } from '@backlog-defeater/api-client';
import { ApiError } from '@backlog-defeater/api-client';
import { apiClient } from '@/api';
import { authClient } from '@/auth-client';
import LoginPrompt from '@/components/shared/LoginPrompt';

const Home = () => {
    const { data: session, isPending } = authClient.useSession();
    const [library, setLibrary] = useState<LibraryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { width } = useWindowDimensions();
    const cardWidth = Math.min(width * 0.38, 150);

    useFocusEffect(
        useCallback(() => {
            if (isPending || !session) return;
            let active = true;
            setLoading(true);
            setError(null);
            apiClient.getLibrary()
                .then((entries) => {
                    if (active) setLibrary(entries);
                })
                .catch((cause: unknown) => {
                    if (active) {
                        console.error("Could not load home library:", cause);
                        setError(cause instanceof ApiError && cause.status === 401
                            ? "Log in to view your games."
                            : "Could not load your library. Please try again.");
                    }
                })
                .finally(() => {
                    if (active) setLoading(false);
                });
            return () => {
                active = false;
            };
        }, [isPending, session]),
    );

    const games = library.flatMap((entry) => entry.game ? [entry.game] : []);
    const playing = library.flatMap((entry) =>
        entry.status === 'playing' && entry.game ? [entry.game] : [],
    );

    if (!isPending && !session) {
        return <LoginPrompt title="Your games" message="Log in to view your games." />;
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.title}>Your games</Text>
                    <Text style={styles.text}>Your library, stored in your account.</Text>
                </View>
                {loading ? (
                    <Text style={styles.text}>Loading your library...</Text>
                ) : error ? (
                    <Text accessibilityRole="alert" style={styles.text}>{error}</Text>
                ) : (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Continue playing</Text>
                            {playing.length > 0 ? (
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={playing}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <GameCoverCard game={item} width={cardWidth} />
                                    )}
                                    contentContainerStyle={{ gap: 12 }}
                                />
                            ) : (
                                <Text style={styles.text}>No games in progress.</Text>
                            )}
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Your library</Text>
                            {games.length > 0 ? (
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={games}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <GameCoverCard game={item} width={cardWidth} />
                                    )}
                                    contentContainerStyle={{ gap: 12 }}
                                />
                            ) : (
                                <Text style={styles.text}>Your library is empty.</Text>
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    safeArea: {
        flex: 1,
        backgroundColor: colors.black
    },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: colors.white },
    text: {
        color: colors.white
    },
    section: { marginTop: 24, gap: 10 },
    sectionTitle: {
        fontSize: 18,
        color: colors.white
    }
});

export default Home;