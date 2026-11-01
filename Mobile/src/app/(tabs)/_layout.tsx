import colors from "@/theme";
import { Tabs } from "expo-router";


export default function TabsLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: colors.navyBlue,
                borderTopColor: colors.wineRed,
            },
            tabBarActiveTintColor: colors.wineRed,
            tabBarInactiveTintColor: colors.white,
        }}>
            <Tabs.Screen name="Home" options={{ title: 'Home' }} />
            <Tabs.Screen name="SearchResults" options={{ title: 'Search' }} />
            <Tabs.Screen name="Library" options={{ title: 'Library' }} />
        </Tabs>
    )
}