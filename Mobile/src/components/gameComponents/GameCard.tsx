//     når brukeren hovrer over et spill i search-results eller library vises et gamecard av spillet. og når brukeren trykker på dette, blir dem sendt til GameInfo.tsx

import { View, Text, StyleSheet } from "react-native";


type GameCardProps = {
  game: {
    id: number;
    name: string;
    total_rating: number;
  };
};

const GameCard = ({ game }: GameCardProps) => {
    return(
        <View>
            <Text>Title: {game.name}</Text>
            <Text>Rating: {game.total_rating}</Text>
        </View>
    )
}

export default GameCard;
