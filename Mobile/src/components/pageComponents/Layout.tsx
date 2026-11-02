import {
    Image,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Link, Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Search from "@/components/searchComponents/Search";
import colors from "@/theme";

const logo = require("../../../assets/images/backlogDefeaterSecondaryLogo2_blue_white2.png");

export default function Layout() {
    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <Link href="/" asChild>
                            <Pressable
                                accessibilityLabel="Backlog Defeater home"
                                style={styles.logoLink}
                            >
                                <Image
                                    source={logo}
                                    style={styles.logo}
                                    resizeMode="contain"
                                    accessibilityLabel="Backlog Defeater logo"
                                />
                            </Pressable>
                        </Link>

                        <View style={styles.navigation}>
                            <Link href="/" asChild>
                                <Pressable style={styles.navButton}>
                                    <Text style={styles.navText}>Home</Text>
                                </Pressable>
                            </Link>

                            <Link href="/Library" asChild>
                                <Pressable style={styles.navButton}>
                                    <Text style={styles.navText}>Library</Text>
                                </Pressable>
                            </Link>
                        </View>

                        <View style={styles.accountNavigation}>
                            <Link href="/LogIn" asChild>
                                <Pressable style={styles.navButton}>
                                    <Text style={styles.navText}>Log in</Text>
                                </Pressable>
                            </Link>

                            <Link href="/SignUp" asChild>
                                <Pressable style={styles.navButton}>
                                    <Text style={styles.navText}>Sign up</Text>
                                </Pressable>
                            </Link>
                        </View>
                    </View>

                    <Search />
                </View>

                <View style={styles.main}>
                    <Slot />
                </View>

                <ScrollView
                    style={styles.footer}
                    contentContainerStyle={styles.footerContent}
                >
                    <Link href="/" asChild>
                        <Pressable
                            accessibilityLabel="Backlog Defeater home"
                            style={styles.footerLogoLink}
                        >
                            <Image
                                source={logo}
                                style={styles.footerLogo}
                                resizeMode="contain"
                                accessibilityLabel="Backlog Defeater logo"
                            />
                        </Pressable>
                    </Link>

                    <View style={styles.footerSection}>
                        <Text style={styles.footerHeading}>About us</Text>
                        <Text style={styles.footerText}>Backlog Defeater</Text>
                        <Text style={styles.footerText}>
                            We use the IGDB API for game data
                        </Text>
                    </View>

                    <View style={styles.footerSection}>
                        <Text style={styles.footerHeading}>Contact us</Text>
                        <Pressable
                            onPress={() =>
                                Linking.openURL("mailto:backlogdefeater@gmail.com")
                            }
                        >
                            <Text style={styles.footerLink}>
                                E-mail: backlogdefeater@gmail.com
                            </Text>
                        </Pressable>
                    </View>

                    <View style={styles.footerSection}>
                        <Text style={styles.footerHeading}>Social media</Text>
                        <View style={styles.socialLinks}>
                            <Text style={styles.footerText}>Instagram</Text>
                            <Text style={styles.footerText}>Facebook</Text>
                            <Text style={styles.footerText}>TikTok</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.black,
    },
    container: {
        flex: 1,
        backgroundColor: colors.black,
    },
    header: {
        paddingHorizontal: 12,
        paddingBottom: 12,
        backgroundColor: colors.navyBlue,
    },
    headerTop: {
        minHeight: 68,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 8,
        paddingVertical: 6,
    },
    logoLink: {
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 58,
        height: 58,
    },
    navigation: {
        flexDirection: "row",
        alignItems: "center",
    },
    accountNavigation: {
        flexDirection: "row",
        alignItems: "center",
    },
    navButton: {
        paddingHorizontal: 8,
        paddingVertical: 10,
    },
    navText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: "600",
    },
    main: {
        flex: 1,
        minHeight: 0,
    },
    footer: {
        flexGrow: 0,
        maxHeight: 150,
        backgroundColor: colors.navyBlue,
    },
    footerContent: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        padding: 12,
    },
    footerLogoLink: {
        alignItems: "center",
        justifyContent: "center",
    },
    footerLogo: {
        width: 48,
        height: 48,
    },
    footerSection: {
        minWidth: 140,
        flexGrow: 1,
        gap: 4,
    },
    footerHeading: {
        color: colors.white,
        fontWeight: "bold",
        marginBottom: 2,
    },
    footerText: {
        color: colors.white,
        fontSize: 12,
    },
    footerLink: {
        color: colors.white,
        fontSize: 12,
        textDecorationLine: "underline",
    },
    socialLinks: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
});