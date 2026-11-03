import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import {
    ApiError,
    igdbImageUrl,
    type IGDBGame,
    type LibraryEntry,
    type LibraryStatus,
} from '@backlog-defeater/api-client';
import { apiClient } from '@/api';
import colors from '@/theme';

const statuses: { value: LibraryStatus; label: string }[] = [
    { value: 'planned', label: 'Planned' },
    { value: 'playing', label: 'Playing' },
    { value: 'completed', label: 'Completed' },
];

const GameInfo = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [game, setGame] = useState<IGDBGame | null>(null);
    const [libraryEntry, setLibraryEntry] = useState<LibraryEntry | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<LibraryStatus>('planned');
    const [loading, setLoading] = useState(true);
    const [libraryLoaded, setLibraryLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        const gameId = Number(id);
        setGame(null);
        setLibraryEntry(null);
        setLibraryLoaded(false);
        setError(null);
        setMessage(null);

        if (!Number.isSafeInteger(gameId) || gameId <= 0) {
            setError('A valid game ID is required.');
            setLoading(false);
            setLibraryLoaded(true);
            return () => {
                active = false;
            };
        }

        setLoading(true);
        apiClient.getGame(gameId)
            .then((result) => {
                if (active) setGame(result);
            })
            .catch((cause: unknown) => {
                if (active) {
                    console.error('Failed to load game details:', cause);
                    setError('Could not load game details. Please try again.');
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        apiClient.getLibrary()
            .then((entries) => {
                if (!active) return;
                const owned = entries.find((entry) => entry.igdbGameId === gameId) ?? null;
                setLibraryEntry(owned);
                if (owned) setSelectedStatus(owned.status);
            })
            .catch((cause: unknown) => {
                if (!(cause instanceof ApiError && cause.status === 401)) {
                    console.error('Failed to check library status:', cause);
                }
            })
            .finally(() => {
                if (active) setLibraryLoaded(true);
            });

        return () => {
            active = false;
        };
    }, [id]);

    const saveStatus = async () => {
        if (!game) return;
        setSaving(true);
        setError(null);
        setMessage(null);
        try {
            const entry = libraryEntry
                ? await apiClient.updateLibraryStatus(game.id, selectedStatus)
                : await apiClient.addToLibrary(game, selectedStatus);
            setLibraryEntry(entry);
            setMessage('Library status saved.');
        } catch (cause: unknown) {
            console.error('Could not save library status:', cause);
            setError(cause instanceof ApiError && cause.status === 401
                ? 'Log in to save games to your library.'
                : 'Could not save the library status. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const removeGame = () => {
        if (!libraryEntry) return;
        Alert.alert('Remove game', `Remove ${game?.name ?? 'this game'} from your library?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove',
                style: 'destructive',
                onPress: () => {
                    setSaving(true);
                    setError(null);
                    void apiClient.removeFromLibrary(libraryEntry.igdbGameId)
                        .then(() => {
                            setLibraryEntry(null);
                            setMessage('Game removed from your library.');
                        })
                        .catch((cause: unknown) => {
                            console.error('Could not remove game from library:', cause);
                            setError(cause instanceof ApiError && cause.status === 401
                                ? 'Log in to manage your library.'
                                : 'Could not remove the game. Please try again.');
                        })
                        .finally(() => setSaving(false));
                },
            },
        ]);
    };

    const releaseDate = game?.firstReleaseDate
        ? new Date(game.firstReleaseDate * 1000).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC',
        })
        : 'Release date unavailable';

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {loading ? <Text style={styles.message}>Loading game details...</Text> : null}
                {error ? <Text accessibilityRole="alert" style={styles.message}>{error}</Text> : null}
                {game ? (
                    <View>
                        <View style={styles.header}>
                            {igdbImageUrl(game.coverImageId) ? (
                                <Image
                                    source={{ uri: igdbImageUrl(game.coverImageId) }}
                                    style={styles.cover}
                                    contentFit="cover"
                                />
                            ) : null}
                            <Text style={styles.title}>{game.name}</Text>
                        </View>
                        <View style={styles.statusOptions}>
                            {statuses.map((status) => (
                                <Pressable
                                    key={status.value}
                                    onPress={() => setSelectedStatus(status.value)}
                                    style={[
                                        styles.statusButton,
                                        selectedStatus === status.value && styles.selectedStatusButton,
                                    ]}
                                >
                                    <Text style={styles.buttonText}>{status.label}</Text>
                                </Pressable>
                            ))}
                        </View>
                        <Pressable
                            style={styles.actionButton}
                            onPress={() => void saveStatus()}
                            disabled={saving || !libraryLoaded}
                        >
                            <Text style={styles.buttonText}>
                                {saving ? 'Saving...' : libraryEntry ? 'Save status' : 'Add to library'}
                            </Text>
                        </Pressable>
                        {libraryEntry ? (
                            <Pressable
                                style={styles.removeButton}
                                onPress={removeGame}
                                disabled={saving}
                            >
                                <Text style={styles.buttonText}>Remove from library</Text>
                            </Pressable>
                        ) : null}
                        {message ? <Text accessibilityRole="text" style={styles.message}>{message}</Text> : null}
                        <View style={styles.detailRow}>
                            <Text style={styles.redTitle}>Release date:</Text>
                            <Text style={styles.whiteText}>{releaseDate}</Text>
                        </View>
                        <Text style={styles.redTitle}>Summary:</Text>
                        <Text style={styles.whiteText}>{game.summary ?? 'No description available.'}</Text>
                    </View>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.black },
    cover: { width: 110, aspectRatio: 3 / 4, borderRadius: 6 },
    header: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    title: { color: colors.white, flex: 1, fontSize: 20, fontWeight: 'bold' },
    message: { color: colors.white, textAlign: 'center', padding: 8 },
    container: { paddingHorizontal: 15, paddingVertical: 8 },
    statusOptions: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    statusButton: {
        borderColor: colors.wineRed,
        borderWidth: 1,
        borderRadius: 18,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    selectedStatusButton: { backgroundColor: colors.wineRed },
    actionButton: {
        backgroundColor: colors.wineRed,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 8,
    },
    removeButton: {
        borderColor: colors.errorColor,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: { color: colors.white, fontWeight: '600' },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 15 },
    whiteText: { color: colors.white, fontSize: 16, lineHeight: 22 },
    redTitle: { color: colors.wineRed, fontSize: 18, fontWeight: '600', marginBottom: 6 },
});

export default GameInfo;
