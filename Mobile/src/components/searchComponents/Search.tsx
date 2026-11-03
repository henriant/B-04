import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Search as SearchIcon } from "lucide-react-native";
import colors from "@/theme";

// Selve søkefeltet. Ved et søk, blir brukeren sendt til SearchResults.tsx, hvor spillene som matcher søkekriteriene vises.

export default function Search() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    function submitSearch() {
        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            return;
        }

        router.push({
            pathname: "/SearchResults",
            params: { q: trimmedQuery },
        });
    }

    return (
        <View style={styles.container}>
            <TextInput
                accessibilityLabel="Search for games"
                style={styles.input}
                placeholder="Search for games..."
                placeholderTextColor="#666666"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={submitSearch}
                returnKeyType="search"
                maxLength={80}
            />

            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Search"
                style={styles.button}
                onPress={submitSearch}
            >
                <SearchIcon color={colors.black} size={22} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
        borderRadius: 12,
        minHeight: 44,
        overflow: "hidden",
    },
    input: {
        flex: 1,
        color: colors.black,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    button: {
        minHeight: 44,
        paddingHorizontal: 12,
        alignItems: "center",
        justifyContent: "center",
    },
});