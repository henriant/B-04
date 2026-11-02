// Hjemmeskjermen etter at en bruker har logget inn. Gir brukeren mulighet til å navigere andre steder i appen, som å se biblioteket sitt, se spillene de har lagt til i watchlist, og se spillene de har vurdert.

import { View, Text, StyleSheet, ScrollView, FlatList, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '@/theme'
import { TESTDATA, TEST_LIBRARY } from '@/data/testGames'
import GameCard from '@/components/gameComponents/GameCard'
import GameBanner from '@/components/gameComponents/GameBanner'
import GameCoverCard from '@/components/gameComponents/GameCoverCard'
import { LibraryEntry } from '@backlog-defeater/api-client'
import { Link } from 'expo-router'


const Home = () => {

    //bare for test. 
    const user1 = 'Ole';

    //TODO: byttes ut med ekte data fra getLibrary()
    const library: LibraryEntry[] = TEST_LIBRARY;

    const playing = library.filter((entry) => entry.status === 'playing');

    // bredden til banneren. Destrukturerer og henter bredde 
    const { width } = useWindowDimensions();
    const bannerWidth = width - 20;


    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView contentContainerStyle={styles.container}>

                <View style={styles.section}>
                    <Text style={styles.title}>Hi, {user1} 👋!</Text>
                    <Text style={styles.text}>Ready to continue playing? 🎮🚀</Text>

                </View>

                <FlatList
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    data={TESTDATA}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <GameBanner game={item} width={bannerWidth} />}
                />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Continue playing</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={playing}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => item.game ? <GameCoverCard game={item.game} width={130} /> : null}
                        contentContainerStyle={{ gap: 12 }}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Popular games</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={TESTDATA}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <GameCard game={item} />}
                        contentContainerStyle={{ gap: 12 }}
                    />
                </View>


            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    safeArea: {
        flex: 1,
        backgroundColor: colors.black
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colors.white
    },
    text: {
        color: colors.white
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        color: colors.white
    }
})

export default Home;