import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/theme";
import { CircleQuestionMark, Settings } from "lucide-react-native";
import MenuRow from "@/components/shared/MenuRow";
import Button from "@/components/shared/Button";
import { authClient } from "@/auth-client";

const Profile = () => {

    const { data: session } = authClient.useSession()

    return (
        <SafeAreaView edges={["top"]} style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.name}>{session?.user.name}</Text>
            <Text style={styles.email}>{session?.user.email}</Text>

            <View style={styles.card}>
                <MenuRow icon={Settings} label="Settings" />
                <View style={styles.divider} />
                <MenuRow icon={CircleQuestionMark} label="Help & support" />
            </View>

            <View style={styles.actionButtons}>
                <Button label="Delete account" variant="outlined" />
                <Button label="Log out" variant="filled" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        paddingHorizontal: 16,
    },
    title: {
        color: colors.white,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    card: {
        backgroundColor: colors.navyBlue,
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    divider: {
        backgroundColor: colors.muted,
        height: StyleSheet.hairlineWidth,
    },
    actionButtons: {
        marginTop: 24,
        gap: 15,
    },
    name: {
        color: colors.white,
        fontSize: 20,
        fontWeight: '600',
    },
    email: {
        color: colors.muted,
        marginBottom: 16,
    },
});

export default Profile;