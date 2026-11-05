import { useCallback, useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    ApiError,
    createApiClient,
    type IGDBGame,
    type LibraryEntry,
} from "@backlog-defeater/api-client";
import { useFocusEffect } from "expo-router";
import GameRow from "@/components/gameComponents/GameRow";
import { API_URL } from "@/config";
import colors from "@/theme";

const apiClient = createApiClient(API_URL);

export default function SearchResults() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<IGDBGame[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [libraryEntries, setLibraryEntries] = useState<LibraryEntry[]>([]);

    useFocusEffect(
        useCallback(() => {
            let active = true;
            apiClient.getLibrary()
                .then((entries) => {
                    if (active) setLibraryEntries(entries);
                })
                .catch((cause: unknown) => {
                    if (!(cause instanceof ApiError && cause.status === 401)) {
                        console.error("Could not load library statuses:", cause);
                    }
                    if (active) setLibraryEntries([]);
                });
            return () => {
                active = false;
            };
        }, []),
    );

    useEffect(() => {
        let cancelled = false;
        const searchQuery = query.trim();

        setError(null);
        if (!searchQuery) {
            setResults([]);
            setLoading(false);
            return () => {
                cancelled = true;
            };
        }

        setLoading(true);
        setResults([]);
        const timeout = setTimeout(() => {
            apiClient.searchGames(searchQuery)
                .then((games) => {
                    if (!cancelled) {
                        setResults(games);
                    }
                })
                .catch((cause: unknown) => {
                    if (!cancelled) {
                        console.error("Game search failed:", cause);
                        setError(
                            cause instanceof Error
                                ? cause.message
                                : "Could not search for games. Please try again.",
                        );
                    }
                })
                .finally(() => {
                    if (!cancelled) {
                        setLoading(false);
                    }
                });
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [query]);

    const searchQuery = query.trim();

    return (
        <SafeAreaView style={styles.safeArea}>
            <TextInput
                style={styles.inputText}
                placeholder="Search for a game..."
                placeholderTextColor={colors.muted}
                value={query}
                onChangeText={setQuery}
                autoCapitalize="none"
                returnKeyType="search"
                accessibilityLabel="Search for a game"
            />

            {!searchQuery ? (
                <Text style={styles.message}>Search for a game</Text>
            ) : error ? (
                <Text accessibilityRole="alert" style={styles.message}>
                    {error}
                </Text>
            ) : loading ? (
                <Text accessibilityRole="text" style={styles.message}>
                    Searching...
                </Text>
            ) : results.length === 0 ? (
                <Text style={styles.message}>No results</Text>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(game) => String(game.id)}
                    renderItem={({ item }) => (
                        <GameRow
                            game={item}
                            status={libraryEntries.find((entry) => entry.igdbGameId === item.id)?.status}
                        />
                    )}
                    contentContainerStyle={styles.results}
                    keyboardShouldPersistTaps="handled"
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.black,
        padding: 15,
    },
    inputText: {
        color: colors.white,
        backgroundColor: colors.navyBlue,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    message: {
        color: colors.white,
        textAlign: "center",
        padding: 5,
    },
    results: {
        gap: 5,
    },
});
