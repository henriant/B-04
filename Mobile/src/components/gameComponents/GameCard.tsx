//     når brukeren trykker på dette, blir dem sendt til GameInfo.tsx

import { View, Text, StyleSheet } from "react-native";


type GameCardProps = {
  game: {
    id: number;
    name: string;
    total_rating: number;
  };
};

const styles = StyleSheet.create({
  card:{
    padding: 10,
    margin: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: 200,
  },
  title:{
    fontSize: 18,
    fontWeight: 'bold',
  },
  rating:{
    fontSize: 16,
  },
})


const GameCard = ({ game }: GameCardProps) => {
    return(
        <View style={styles.card}>
            <Text style={styles.title}>Title: {game.name}</Text>
            <Text style={styles.rating}>Rating: {Math.round(game.total_rating)}</Text>
        </View>
    )
}


export default GameCard;


