import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import colors from "@/theme";
import Button from "@/components/shared/Button";

type LoginPromptProps = {
    title: string;
    message: string;
};

const LoginPrompt = ({ title, message }: LoginPromptProps) => {
    return (
        <SafeAreaView edges={["top"]} style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttons}>
                <Button label="Log in" variant="filled" onPress={() => router.push("/LogIn")} />
                <Button label="Sign up" variant="outlined" onPress={() => router.push("/SignUp")} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        paddingHorizontal: 16,
    },
    title: {
        color: colors.white,
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    message: {
        color: colors.muted,
        marginBottom: 16,
    },
    buttons: {
        marginTop: 24,
        gap: 15,
    },
});

export default LoginPrompt;