import { Stack } from "expo-router";
import colors from "@/theme";

export const unstable_settings = {
    anchor: "(tabs)",
};

export default function RootLayout() {
    return (
        <Stack screenOptions={{
                headerShown: false,
                headerStyle: { backgroundColor: colors.black },
                headerTintColor: colors.white,
                headerShadowVisible: false,
                contentStyle: { backgroundColor: colors.black },
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen
                name="LogIn"
                options={{ headerShown: true, title: "Log In" }}
            />
            <Stack.Screen
                name="SignUp"
                options={{ headerShown: true, title: "Sign Up" }}
            />
            <Stack.Screen
                name="GameInfo"
                options={{ headerShown: true, title: "Game" }}
            />
        </Stack>
    );
}