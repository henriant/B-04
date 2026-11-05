"use client";

import { useEffect, useState } from "react";
import {
    ApiError,
    createApiClient,
    igdbImageUrl,
    type LibraryEntry,
} from "@backlog-defeater/api-client";
import type { LibraryFilterStatus } from "@/constants/library";
import { removeGameFromLibrary } from "@/lib/library-actions";
import { filterLibraryEntries } from "@/lib/library-filter";

type LibraryListProps = {
    query: string;
    status: LibraryFilterStatus;
};

const libraryApiUrl = import.meta.env.VITE_API_BASE_URL;
const libraryApiClient = createApiClient(libraryApiUrl);

export function LibraryList({ query, status }: LibraryListProps) {
    // Disse verdiene styrer lasting, feil og spillene som vises.
    const [games, setGames] = useState<LibraryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [removingGameId, setRemovingGameId] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;

        // Stopp tidlig hvis adressen til bibliotekserveren ikke er satt opp.
        if (!libraryApiUrl) {
            setError("API URL is not configured.");
            setLoading(false);
            return () => {
                cancelled = true;
            };
        }

        // Hent biblioteket én gang når komponenten vises.
        libraryApiClient
            .getLibrary()
            .then((entries) => {
                if (!cancelled) {
                    setGames(entries);
                    setError(null);
                }
            })
            .catch((cause: unknown) => {
                if (!cancelled) {
                    console.error("Could not load library:", cause);
                    setError(
                        cause instanceof ApiError && cause.status === 401
                            ? "Log in to view your library."
                            : "Could not load your library. Please try again.",
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const handleRemove = async (entry: LibraryEntry) => {
        if (!window.confirm(`Remove ${entry.game?.name ?? "this game"} from your library?`)) {
            return;
        }

        setRemovingGameId(entry.igdbGameId);
        setError(null);
        try {
            const result = await removeGameFromLibrary(entry.igdbGameId);
            if (!result.ok) {
                throw new ApiError(result.status, result.message);
            }
            setGames((current) =>
                current.filter((game) => game.igdbGameId !== entry.igdbGameId),
            );
        } catch (cause: unknown) {
            console.error("Could not remove game from library:", cause);
            setError(
                cause instanceof ApiError && cause.status === 401
                    ? "Log in to manage your library."
                    : "Could not remove the game. Please try again.",
            );
        } finally {
            setRemovingGameId(null);
        }
    };

    // Filtrer spillene fra brukerens bibliotek etter status og søk.
    const normalizedQuery = query.trim();
    const filteredGames = filterLibraryEntries(games, query, status);

    if (loading) {
        return <p role="status" className="text">Loading your library...</p>;
    }

    if (error) {
        return <p role="alert" className="text">{error}</p>;
    }

    if (filteredGames.length === 0) {
        return <p className="text">{normalizedQuery ? "No matching games found." : "Your library is empty."}</p>;
    }

    return (
        <>
            {filteredGames.map((entry) => (
                <article className="game" key={entry.igdbGameId}>
                    <a className="library-game-card" href={`/GameInfo?id=${entry.igdbGameId}`}>
                        {/* Navn og status vises oppå coveret ved hover eller tastaturfokus. */}
                        <div className="library-game-cover">
                            {igdbImageUrl(entry.game?.coverImageId) ? (
                                <img
                                    className="library-game-img"
                                    src={igdbImageUrl(entry.game?.coverImageId)}
                                    alt={`Cover for ${entry.game?.name ?? "game"}`}
                                    loading="lazy"
                                />
                            ) : (
                                <div className="library-game-img" aria-label="No cover available">
                                    No cover available
                                </div>
                            )}
                            <div className="library-game-hover">
                                <h3>{entry.game?.name ?? "Unknown game"}</h3>
                                <p>Status: {entry.status}</p>
                            </div>
                        </div>
                        <h2>{entry.game?.name ?? "Unknown game"}</h2>
                    </a>
                    <button
                        className="add-remove-button"
                        type="button"
                        disabled={removingGameId === entry.igdbGameId}
                        onClick={() => void handleRemove(entry)}
                    >
                        {removingGameId === entry.igdbGameId ? "Removing..." : "Remove from library"}
                    </button>
                </article>
            ))}
        </>
    );
}
