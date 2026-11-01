import { Tabs } from "expo-router";


export default function TabsLayout(){
    return(
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="Home" options={{ title: 'Home'}}/>
            <Tabs.Screen name="Library" options={{ title: 'Library' }}/>
            <Tabs.Screen name="SearchResults" options={{ title: 'Search' }}/>
        </Tabs>
    )
}