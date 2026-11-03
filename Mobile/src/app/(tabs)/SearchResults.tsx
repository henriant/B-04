import { useEffect, useState } from "react";
import {
    FlatList,
    Pressable,
    Text,
    View,
} from "react-native";
import { Image } from "expo-image";
import { Link, useLocalSearchParams } from "expo-router";
import {
    createApiClient,
    igdbImageUrl,
    type IGDBGame,
} from "@backlog-defeater/api-client";
import { API_URL } from "@/config";
import colors from "@/theme";

const apiClient = createApiClient(API_URL);

export default function SearchResults() {
    const { q } = useLocalSearchParams<{ q?: string }>();
    const query = typeof q === "string" ? q.trim() : "";

import { type IGDBGame } from '@backlog-defeater/api-client';
import { View, Text, TextInput, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { searchTestGames } from '@/data/testGames';
import colors from '@/theme';
import GameRow from '@/components/gameComponents/GameRow';



const SearchResults = () => {

    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<IGDBGame[]>([]);
    const [loading, setLoading] = useState(Boolean(query));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        setResults([]);
        setError(null);

        if (!query) {
            setLoading(false);

            return () => {
                cancelled = true;
            };
        }

        setLoading(true);

        apiClient.searchGames(query)
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
            <View style={{ paddingHorizontal: 15, gap: 5 }}>
                <FlatList
                data={results}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (<GameRow game={item} />
                )}
            />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.black }}>
            <Text style={{ color: colors.white }}>
                {query ? `Games matching "${query}"` : "Search for a game"}
            </Text>

            {query !== "" && loading && (
                <Text style={{ color: colors.white }}>
                    Searching for games...
                </Text>
            )}

            {query !== "" && !loading && error && (
                <Text accessibilityRole="alert" style={{ color: colors.white }}>
                    {error}
                </Text>
            )}

            {query !== "" && !loading && !error && results.length === 0 && (
                <Text style={{ color: colors.white }}>No games found</Text>
            )}

            {!loading && !error && results.length > 0 && (
                <FlatList
                    style={{ flex: 1 }}
                    data={results}
                    keyExtractor={(game) => String(game.id)}
                    renderItem={({ item }) => {
                        const coverUrl = igdbImageUrl(item.coverImageId);

                        return (
                            <Link
                                href={{
                                    pathname: "/GameInfo",
                                    params: { id: String(item.id) },
                                }}
                                asChild
                            >
                                <Pressable>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 12,
                                            padding: 10,
                                        }}
                                    >
                                        {coverUrl ? (
                                            <Image
                                                source={{ uri: coverUrl }}
                                                style={{
                                                    width: 60,
                                                    height: 80,
                                                    borderRadius: 6,
                                                }}
                                                contentFit="cover"
                                                accessibilityLabel={`Cover for ${item.name}`}
                                            />
                                        ) : (
                                            <View
                                                style={{
                                                    width: 60,
                                                    height: 80,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: colors.navyBlue,
                                                }}
                                            >
                                                <Text style={{ color: colors.white }}>
                                                    No cover
                                                </Text>
                                            </View>
                                        )}

                                        <Text style={{ color: colors.white }}>
                                            {item.name}
                                        </Text>
                                    </View>
                                </Pressable>
                            </Link>
                        );
                    }}
                />
            )}
        </View>
    );
}