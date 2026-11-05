import { Link } from "expo-router";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/theme";

export default function Index() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.intro}>
                    <Text style={styles.title}>Backlog Defeater</Text>
                    <Text style={styles.subtitle}>Track your games.</Text>
                    <Text style={styles.subtitle}>Discover new worlds!</Text>
                </View>

                <View style={styles.actions}>
                    <Link href="/SearchResults" asChild>
                        <Pressable style={styles.primaryButton}>
                            <Text style={styles.primaryButtonText}>Search games</Text>
                        </Pressable>
                    </Link>
                    <Link href="/LogIn" asChild>
                        <Pressable style={styles.secondaryButton}>
                            <Text style={styles.secondaryButtonText}>Log in</Text>
                        </Pressable>
                    </Link>
                    <Link href="/SignUp" asChild>
                        <Pressable style={styles.secondaryButton}>
                            <Text style={styles.secondaryButtonText}>Sign up</Text>
                        </Pressable>
                    </Link>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.black,
    },
    content: {
        flexGrow: 1,
        justifyContent: "center",
        gap: 24,
        paddingVertical: 24,
    },
    intro: {
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        color: colors.white,
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 12,
    },
    subtitle: {
        color: colors.white,
        fontSize: 18,
        marginBottom: 8,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 10,
        paddingHorizontal: 16,
    },
    primaryButton: {
        backgroundColor: colors.wineRed,
        borderRadius: 8,
        paddingHorizontal: 18,
        paddingVertical: 12,
    },
    primaryButtonText: {
        color: colors.white,
        fontWeight: "bold",
    },
    secondaryButton: {
        borderColor: colors.wineRed,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 18,
        paddingVertical: 12,
    },
    secondaryButtonText: {
        color: colors.white,
        fontWeight: "600",
    },
});