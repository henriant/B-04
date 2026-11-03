import { Link } from "expo-router";
import { Pressable, ScrollView, Text } from "react-native";

export default function Index() {
    return (
        <ScrollView>
            <Text>Backlog Defeater</Text>
            <Text>Track your games.</Text>
            <Text>Discover new worlds!</Text>

            <Link href="/LogIn" asChild>
                <Pressable>
                    <Text>Log In</Text>
                </Pressable>
            </Link>

            <Link href="/SignUp" asChild>
                <Pressable>
                    <Text>Sign Up</Text>
                </Pressable>
            </Link>
        </ScrollView>
    );
}