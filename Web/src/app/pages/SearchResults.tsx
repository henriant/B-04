// Viser alle spillene som matcher søkefilter som brukeren skriver i søkefeltet Search.tsx. Disse kan klikkes på for å vise GameInfo.tsx for det spesifikke spillet.
"use client";

import { useEffect, useState } from "react";
import {
    ApiError,
    createApiClient,
    igdbImageUrl,
    type IGDBGame,
    type LibraryStatus,
} from "@backlog-defeater/api-client";

const apiClient = createApiClient(import.meta.env.VITE_API_BASE_URL);
const libraryApiClient = createApiClient(import.meta.env.VITE_API_BASE_URL);

type SearchResultsProps = {
    query: string;
};

export function SearchResults({ query }: SearchResultsProps) {
    const normalizedQuery = query.trim();

    const [games, setGames] = useState<IGDBGame[]>([]);
    const [loading, setLoading] = useState(Boolean(normalizedQuery));
    const [error, setError] = useState<string | null>(null);
    const [savingGameIds, setSavingGameIds] = useState<Set<number>>(() => new Set());
    const [addErrors, setAddErrors] = useState<Record<number, string>>({});
    const [selectedStatuses, setSelectedStatuses] = useState<Record<number, LibraryStatus>>({});
    const [libraryStatuses, setLibraryStatuses] = useState<Record<number, LibraryStatus>>({});
    const [libraryLoaded, setLibraryLoaded] = useState(false);
    const [libraryLoadError, setLibraryLoadError] = useState<string | null>(null);

    // Legg til nye spill, eller oppdater statusen hvis spillet allerede eies.
    const handleSaveStatus = async (game: IGDBGame) => {
        setAddErrors((current) => {
            const next = { ...current };
            delete next[game.id];
            return next;
        });
        setSavingGameIds((current) => new Set(current).add(game.id));

        try {
            const status = selectedStatuses[game.id] ?? libraryStatuses[game.id] ?? "planned";
            if (libraryStatuses[game.id]) {
                await libraryApiClient.updateLibraryStatus(game.id, status);
            } else {
                await libraryApiClient.addToLibrary(game, status);
            }
            setLibraryStatuses((current) => ({ ...current, [game.id]: status }));
            setSelectedStatuses((current) => ({ ...current, [game.id]: status }));
        } catch (cause: unknown) {
            console.error("Could not save game status:", cause);
            const message = cause instanceof ApiError && cause.status === 401
                ? "Log in to save games to your library."
                : "Could not save this game status. Please try again.";
            setAddErrors((current) => ({ ...current, [game.id]: message }));
        } finally {
            setSavingGameIds((current) => {
                const next = new Set(current);
                next.delete(game.id);
                return next;
            });
        }
    };

    useEffect(() => {
        let canceled = false;

        setGames([]);
        setError(null);
        setLibraryStatuses({});
        setSelectedStatuses({});
        setLibraryLoaded(false);
        setLibraryLoadError(null);

        if (!normalizedQuery) {
            setLoading(false);
            setLibraryLoaded(true);
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

        // Hent eierens statuser slik at søkeresultatene viser riktig bibliotekstatus.
        libraryApiClient.getLibrary()
            .then((entries) => {
                if (!canceled) {
                    const statuses: Record<number, LibraryStatus> = {};
                    for (const entry of entries) {
                        statuses[entry.igdbGameId] = entry.status;
                    }
                    setLibraryStatuses(statuses);
                    setSelectedStatuses(statuses);
                }
            })
            .catch((cause: unknown) => {
                if (!canceled && !(cause instanceof ApiError && cause.status === 401)) {
                    console.error("Could not load library statuses:", cause);
                    setLibraryLoadError("Could not check your library status. Please try again.");
                }
            })
            .finally(() => {
                if (!canceled) {
                    setLibraryLoaded(true);
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
            <p role="status" className="text">Searching for your games...</p>
        )}
        {normalizedQuery && !loading && error && (
            <p role="alert">{error}</p>
        )}
        {normalizedQuery && libraryLoadError && (
            <p role="alert">{libraryLoadError}</p>
        )}
        {normalizedQuery && !loading && !error && games.length === 0 && (
            <p className="text">No games found</p>
        )}
        {!loading && !error && games.length > 0 && (
            <ul>
                {games.map((game) => (
                    <li key={game.id} className="searchResults-game">
                        <a className="search-result-card" href={`/GameInfo?id=${game.id}`}>
                            {imageUrl(game) ? (
                                <img className="library-game-img" src={imageUrl(game)} alt={`Cover for ${game.name}`}
                                loading="lazy" />
                            ) : (
                                <div className="search-result-cover-placeholder" aria-label="No cover available">
                                    No cover
                                </div>
                            )}
                            <h2>{game.name}</h2>
                            {/* Hover viser om spillet finnes i biblioteket og hvilken status det har. */}
                            <div className="search-result-hover">
                                <h3>{game.name}</h3>
                                {!libraryLoaded ? (
                                    <p className="text">Checking your library...</p>
                                ) : libraryLoadError ? (
                                    <p>{libraryLoadError}</p>
                                ) : libraryStatuses[game.id] ? (
                                    <p className="text">In your library · Status: {libraryStatuses[game.id][0].toUpperCase() + libraryStatuses[game.id].slice(1)}</p>
                                ) : (
                                    <p className="text">Not in your library</p>
                                )}
                            </div>
                        </a>
                        <label className="search-result-status">
                            Status
                            <select
                                aria-label={`Status for ${game.name}`}
                                value={selectedStatuses[game.id] ?? "planned"}
                                onChange={(event) => setSelectedStatuses((current) => ({
                                    ...current,
                                    [game.id]: event.target.value as LibraryStatus,
                                }))}
                                disabled={savingGameIds.has(game.id) || !libraryLoaded || Boolean(libraryLoadError)}
                            >
                                <option value="planned">Planned</option>
                                <option value="playing">Playing</option>
                                <option value="completed">Completed</option>
                            </select>
                        </label>
                        <button
                            className="add-remove-button" id="add-button"
                            type="button"
                            onClick={() => void handleSaveStatus(game)}
                            disabled={savingGameIds.has(game.id) || !libraryLoaded || Boolean(libraryLoadError)}
                        >
                            {savingGameIds.has(game.id)
                                ? "Saving..."
                                : libraryStatuses[game.id]
                                    ? "Save status"
                                    : "Add to library"}
                        </button>
                        {addErrors[game.id] && (
                            <p role="alert">{addErrors[game.id]}</p>
                        )}
                    </li>
                ))}
            </ul>
        )}
    </section>
)}