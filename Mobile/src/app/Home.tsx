// Hjemmeskjermen etter at en bruker har logget inn. Gir brukeren mulighet til å navigere andre steder i appen, som å se biblioteket sitt, se spillene de har lagt til i watchlist, og se spillene de har vurdert.

import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

const Home = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text>Welcome to the Game App!</Text>
                
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home;