//     når brukeren trykker på dette, blir dem sendt til GameInfo.tsx

import { type IGDBGame, igdbImageUrl } from "@backlog-defeater/api-client";
import { Link } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import colors from "@/theme";



type GameCardProps = {
  game: IGDBGame
};

const GameCard = ({ game }: GameCardProps) => {

  //Til sjekk om spillet har bilde
  const imageUrl = igdbImageUrl(game.coverImageId);

  return (
    <View style={styles.card}>
      <Link href={{ pathname: '/GameInfo', params: { id: game.id } }} asChild>
        <Pressable>
          {imageUrl !== '' && (
            <Image
              source={{ uri: imageUrl }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {game.name}
            </Text>
          </View>
        </Pressable>
      </Link>
    </View>

  )
}


const styles = StyleSheet.create({
  card: {
    //padding: 10,
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    height: 90,
    width: 200,
  },
  titleContainer: {
    //backgroundColor: '#191f4585',
    padding: 8,
  },
  title: {
    color: colors.black,
        fontSize: 18,
        fontWeight: 'bold',
  },
})



export default GameCard;


