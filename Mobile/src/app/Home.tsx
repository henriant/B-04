// Hjemmeskjermen etter at en bruker har logget inn. Gir brukeren mulighet til å navigere andre steder i appen, som å se biblioteket sitt, se spillene de har lagt til i watchlist, og se spillene de har vurdert.

import { Text, StyleSheet, ScrollView, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '@/theme'
import { TESTDATA } from '@/data/testGames'
import GameCard from '@/components/gameComponents/GameCard'


const Home = () => {

    //bare for test. 
    const user1 = 'Ole'

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Hi, {user1} 👋!</Text>
                <Text style={styles.text}>Ready to continue playing? 🎮🚀</Text>
                
                <Text style={styles.text}>Popular games</Text>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={TESTDATA}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <GameCard game={item}/>}
                    contentContainerStyle={{ gap: 12 }}
                />


            </ScrollView>
        </SafeAreaView>
    )
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
})

export default Home;