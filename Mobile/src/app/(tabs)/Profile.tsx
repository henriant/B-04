import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/theme";

const Profile = () => {
    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.black }}>
            <Text style={{ color: colors.white }}>Profile</Text>
        </SafeAreaView>
    );
}

export default Profile;