// Selve base of operations for brukeren, hvor de får vist alle spillene de eier (spillene de har lagt til i library)

import { getTestLibrary } from '@/data/testGames';
import { type LibraryEntry, type LibraryStatus } from '@backlog-defeater/api-client/src/types'
import { useState, useEffect } from 'react'
import { View, Text, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';


const Library = () => {

    const [entries, setEntries] = useState<LibraryEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<LibraryStatus>('playing');

    useEffect(() => {

        let isCancelled = false;

        setLoading(true);
        setError(null);

        // Simulerer henting av library-spillene til en bruker. TODO: byttes ut med getLibrary() fra packages>api-client>src>index
        getTestLibrary()
            .then((result) => {
                if (!isCancelled) {
                    setEntries(result);
                }
            })
            .catch((err) => {
                if (!isCancelled) {
                    console.error("Library fetch failed:", err)
                    setError("Could not load your library. Please try again")
                }
            })
            .finally(() => {
                if (!isCancelled) {
                    setLoading(false);
                }
            });

        return () => { isCancelled = true; }

    }, []);

    const filteredEntries = entries.filter(entry => entry.status === status);

    const renderContent = () => {

        if (loading) {
            return <Text>Loading...</Text>
        }
        if (error) {
            return <Text>{error}</Text>
        }
        if (filteredEntries.length === 0) {
            return <Text>No games here yet </Text>
        }


        return (
            <FlatList
                data={filteredEntries}
                keyExtractor={(entry) => String(entry.id)}
                renderItem={({ item }) => item.game ? (
                    <Text>{item.game.name}</Text>
                ) : null}
            />
        )
    }

    return (
        <SafeAreaView>
            <View>
                <Text>Library</Text>
                {renderContent()}
            </View>
        </SafeAreaView>

    )
}

export default Library 