// Bruker IgdbGameData til å sette opp et spillkort

import type { IgdbGameData } from "@/app/shared/game-types";

interface GameProps{
    game: IgdbGameData;
}

export function GameCard({ game }: GameProps) {
    const coverUrl = game.cover?.url 
    ? game.cover.url.startsWith("//") 
        ? `https:${game.cover.url}` 
        : game.cover.url 
    : undefined;

    return (
        <article className="gameCard">
            {coverUrl ? (<img className="gameCard-cover" src={coverUrl} alt={`Cover for ${game.name}`} />) 
            : (<div className="gameCard-cover gameCard-cover-placeholder" aria-label="No cover available">No cover</div>)}
            <h1 className="game-name">{game.name}</h1>
        </article>
    );
}