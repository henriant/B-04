import { IgdbGameData } from "../../app/shared/game-types";


//     når brukeren hovrer over et spill i search-results eller library vises et gamecard av spillet. og når brukeren trykker på dette, blir dem sendt til GameInfo.tsx

// Komponenten tar imot spill fra IgdbGameData
interface GameCardProps {
    game: IgdbGameData;
}

export function GameCard({ game }: GameCardProps) {
    return(
        <div className="game-card-hover">
            {game.cover?.url && <img src={game.cover.url} alt={game.name} />}
            <h3>{game.name}</h3>
            {game.rating && <p>Rating: {Math.round(game.rating)}/100</p>}
        </div>
    )
};

