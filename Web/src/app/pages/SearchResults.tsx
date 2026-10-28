// Viser alle spillene som matcher søkefilter som brukeren skriver i søkefeltet Search.tsx. Disse kan klikkes på for å vise GameInfo.tsx for det spesifikke spillet.
"use client";

import { useEffect, useState } from "react";
import {createApiClient, igdbImageUrl, type IGDBGame,} from "@backlog-defeater/api-client";
import { normalize } from "better-auth";

const apiClient = createApiClient(import.meta.env.VITE_API_BASE_URL);

type SearchResultsProps = {
    query: string;
};

export function SearchResults({ query }: SearchResultsProps) {
    const normalizedQuery = query.trim();

    const [games, setGames] = useState<IGDBGame[]>([]);
    const [loading, setLoading] = useState(Boolean(normalizedQuery));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let canceled = false;

        setGames([]);
        setError(null);

        if (!normalizedQuery) {
            setLoading(false);
            return () => {
                canceled = true;
            };
        }

        setLoading(true);

        apiClient.searchGames(normalizedQuery)
            .then((results) => {
                if (!canceled) {
                    setGames(results);
                }
            })
            .catch((cause: unknown) => {
                if (!canceled) {
                    console.error("Game search failed:", cause);
                        setError("Could not search for games. Please try again.");
                    }
            })
            .finally(() => {
                if (!canceled) {
                    setLoading(false);
                }
            });
    return() => {
        canceled = true;
    };
}, [normalizedQuery]);

const imageUrl = (game: IGDBGame) => igdbImageUrl(game.coverImageId);

return (
    <section id="search-results">
        <h1 id="search-results-title">
            {normalizedQuery ? `Games matching "${normalizedQuery}":`: "Search for a game"}
        </h1>
        {normalizedQuery && loading && (
            <p role="status">Searching for your games...</p>
        )}
        {normalizedQuery && !loading && error && (
            <p role="alert">{error}</p>
        )}
        {normalizedQuery && !loading && !error && games.length === 0 && (
            <p>No games found</p>
        )}
        {!loading && !error && games.length > 0 && (
            <ul>
                {games.map((game) => (
                    <li key={game.id} className="searchResults-game">
                        <a href={`/GameInfo?id=${game.id}`}>
                            {imageUrl(game) ? (
                                <img className="library-game-img" src={imageUrl(game)} alt={`Cover for ${game.name}`}
                                loading="lazy" />
                            ) : (
                                <div aria-label="No cover available">
                                    No cover
                                </div>
                            )}
                            <h2>{game.name}</h2>
                        </a>
                    </li>
                ))}
            </ul>
        )}
    </section>
)}