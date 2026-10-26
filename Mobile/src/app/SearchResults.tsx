// Viser alle spillene som matcher søkefilter som brukeren skriver i søkefeltet Search.tsx. Disse kan klikkes på for å vise GameInfo.tsx for det spesifikke spillet.

import { type IGDBGame } from '@backlog-defeater/api-client'
import { View, TextInput, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { searchTestGames } from '@/data/testGames'
import colors from '@/theme'



const SearchResults = () => {

    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<IGDBGame[]>([]);
    const [error, setError] = useState<string | null>(null);


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={{padding: 15}}>
                <TextInput style={styles.inputText}
                    placeholder='Search for a game..'
                    placeholderTextColor='#fcfcfc58'
                    value={query}
                    onChangeText={setQuery}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.black
    },
    inputText: {
        color: colors.white,
        backgroundColor: colors.navyBlue,
        padding: 10,
        borderRadius: 10
    }
})


export default SearchResults