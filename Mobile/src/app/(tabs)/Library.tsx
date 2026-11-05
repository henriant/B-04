import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { ApiError, type LibraryEntry, type LibraryStatus } from '@backlog-defeater/api-client';
import { apiClient } from '@/api';
import GameRow from '@/components/gameComponents/GameRow';
import { STATUS_OPTIONS } from '@/constants/library';
import colors from '@/theme';
import { authClient } from '@/auth-client';
import LoginPrompt from '@/components/shared/LoginPrompt';

const Library = () => {
    const { data: session, isPending } = authClient.useSession();
    const [entries, setEntries] = useState<LibraryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<LibraryStatus>('playing');
    const [savingGameId, setSavingGameId] = useState<number | null>(null);

    const loadLibrary = useCallback(() => {
        if (isPending || !session) return;
        let active = true;
        setLoading(true);
        setError(null);
        apiClient.getLibrary()
            .then((result) => {
                if (active) setEntries(result);
            })
            .catch((cause: unknown) => {
                if (active) {
                    console.error("Library fetch failed:", cause);
                    setError(cause instanceof ApiError && cause.status === 401
                        ? "Log in to view your library."
                        : "Could not load your library. Please try again.");
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [isPending, session]);

    useFocusEffect(loadLibrary);

    const updateStatus = async (gameId: number, nextStatus: LibraryStatus) => {
        setSavingGameId(gameId);
        setError(null);
        try {
            const updated = await apiClient.updateLibraryStatus(gameId, nextStatus);
            setEntries((current) => current.map((entry) =>
                entry.igdbGameId === gameId ? updated : entry,
            ));
        } catch (cause: unknown) {
            console.error("Could not update library status:", cause);
            setError("Could not update the game status. Please try again.");
        } finally {
            setSavingGameId(null);
        }
    };

    const removeGame = (entry: LibraryEntry) => {
        Alert.alert(
            "Remove game",
            `Remove ${entry.game?.name ?? "this game"} from your library?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => {
                        setSavingGameId(entry.igdbGameId);
                        setError(null);
                        void apiClient.removeFromLibrary(entry.igdbGameId)
                            .then(() => setEntries((current) =>
                                current.filter((item) => item.igdbGameId !== entry.igdbGameId),
                            ))
                            .catch((cause: unknown) => {
                                console.error("Could not remove library game:", cause);
                                setError("Could not remove the game. Please try again.");
                            })
                            .finally(() => setSavingGameId(null));
                    },
                },
            ],
        );
    };

    const filteredEntries = entries.filter((entry) => entry.status === status);

    if (!isPending && !session) {
        return <LoginPrompt title="Library" message="Log in to view your library." />;
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <Text style={styles.title}>Library</Text>
                <View style={styles.filterRow}>
                    {STATUS_OPTIONS.map((option) => (
                        <Pressable
                            key={option.value}
                            onPress={() => setStatus(option.value)}
                            style={[styles.filterButton, status === option.value && styles.selectedFilterButton]}
                        >
                            <Text style={styles.filterText}>{option.label}</Text>
                        </Pressable>
                    ))}
                </View>
                {error ? <Text accessibilityRole="alert" style={styles.message}>{error}</Text> : null}
                {loading ? (
                    <Text style={styles.message}>Loading your library...</Text>
                ) : filteredEntries.length === 0 ? (
                    <Text style={styles.message}>No games in this status.</Text>
                ) : (
                    <FlatList
                        data={filteredEntries}
                        keyExtractor={(entry) => String(entry.igdbGameId)}
                        renderItem={({ item }) => (
                            <View style={styles.entry}>
                                {item.game ? <GameRow game={item.game} status={item.status} /> : null}
                                <View style={styles.statusRow}>
                                    {STATUS_OPTIONS.map((option) => (
                                        <Pressable
                                            key={option.value}
                                            disabled={savingGameId === item.igdbGameId || item.status === option.value}
                                            onPress={() => void updateStatus(item.igdbGameId, option.value)}
                                            style={[
                                                styles.statusButton,
                                                item.status === option.value && styles.selectedStatusButton,
                                            ]}
                                        >
                                            <Text style={styles.statusText}>{option.label}</Text>
                                        </Pressable>
                                    ))}
                                    <Pressable
                                        disabled={savingGameId === item.igdbGameId}
                                        onPress={() => removeGame(item)}
                                        style={styles.removeButton}
                                    >
                                        <Text style={styles.statusText}>Remove</Text>
                                    </Pressable>
                                </View>
                            </View>
                        )}
                        contentContainerStyle={styles.list}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.black },
    container: { flex: 1, padding: 15, gap: 16 },
    title: { fontSize: 24, fontWeight: 'bold', color: colors.white },
    message: { color: colors.white, textAlign: 'center', padding: 8 },
    filterRow: { flexDirection: 'row', gap: 8 },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.wineRed,
    },
    selectedFilterButton: { backgroundColor: colors.wineRed },
    filterText: { color: colors.white, fontWeight: '600' },
    list: { gap: 14, paddingBottom: 20 },
    entry: { gap: 6 },
    statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingLeft: 72 },
    statusButton: {
        borderColor: colors.wineRed,
        borderWidth: 1,
        borderRadius: 16,
        paddingVertical: 5,
        paddingHorizontal: 9,
    },
    selectedStatusButton: { backgroundColor: colors.wineRed },
    removeButton: {
        borderColor: colors.errorColor,
        borderWidth: 1,
        borderRadius: 16,
        paddingVertical: 5,
        paddingHorizontal: 9,
    },
    statusText: { color: colors.white, fontSize: 12 },
});

export default Library;