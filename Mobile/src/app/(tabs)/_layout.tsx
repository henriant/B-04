import { Tabs } from "expo-router";
import { House, Library, Search } from "lucide-react-native";
import colors from "@/theme";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.navyBlue,
                    borderTopColor: colors.wineRed,
                },
                tabBarActiveTintColor: colors.wineRed,
                tabBarInactiveTintColor: colors.muted,
            }}
        >
            <Tabs.Screen
                name="Home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <House color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="SearchResults"
                options={{
                    title: "Search",
                    tabBarIcon: ({ color, size }) => (
                        <Search color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Library"
                options={{
                    title: "Library",
                    tabBarIcon: ({ color, size }) => (
                        <Library color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}