import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/theme";
import { CircleQuestionMark, Settings } from "lucide-react-native";
import MenuRow from "@/components/shared/MenuRow";

const Profile = () => {
    return (
        <SafeAreaView edges={["top"]} style={styles.container}>
            <Text style={styles.title}>Profile</Text>

            <View style={styles.card}>
                <MenuRow icon={Settings} label="Settings" />
                <View style={styles.divider} />
                <MenuRow icon={CircleQuestionMark} label="Help & support"  />
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
    }
});

export default Profile;