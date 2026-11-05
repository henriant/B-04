"use client";

import { useEffect, useState } from "react";
import {
    ApiError,
    createApiClient,
    igdbImageUrl,
    type IGDBGame,
    type LibraryStatus,
} from "@backlog-defeater/api-client";
import {
    addGameToLibrary,
    updateGameLibraryStatus,
} from "@/lib/library-actions";

const gameApiClient = createApiClient(import.meta.env.VITE_API_BASE_URL);
const libraryApiClient = createApiClient(import.meta.env.VITE_API_BASE_URL);

const statuses: { value: LibraryStatus; label: string }[] = [
    { value: "planned", label: "Planned" },
    { value: "playing", label: "Playing" },
    { value: "completed", label: "Completed" },
];

type GameInfoProps = {
    gameId: string;
};

export function GameInfo({ gameId }: GameInfoProps) {
    const [game, setGame] = useState<IGDBGame | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<LibraryStatus>("planned");
    const [isInLibrary, setIsInLibrary] = useState(false);
    const [libraryLoaded, setLibraryLoaded] = useState(false);
    const [libraryError, setLibraryError] = useState<string | null>(null);
    const [savingStatus, setSavingStatus] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [statusError, setStatusError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        const id = Number(gameId);

        setGame(null);
        setError(null);
        setLibraryError(null);
        setStatusError(null);
        setStatusMessage(null);
        setIsInLibrary(false);
        setSelectedStatus("planned");
        setLibraryLoaded(false);
        setLoading(true);

        if (!Number.isSafeInteger(id) || id <= 0) {
            setError("A valid game ID is required.");
            setLoading(false);
            return () => {
                cancelled = true;
            };
        }

        // Hent full spillinformasjon fra IGDB og statusen fra brukerens bibliotek.
        gameApiClient.getGame(id)
            .then((result) => {
                if (!cancelled) {
                    setGame(result);
                }
            })
            .catch((cause: unknown) => {
                if (!cancelled) {
                    console.error("Could not load game details:", cause);
                    setError("Could not load game details. Please try again.");
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        libraryApiClient.getLibrary()
            .then((entries) => {
                if (!cancelled) {
                    const entry = entries.find((item) => item.igdbGameId === id);
                    if (entry) {
                        setIsInLibrary(true);
                        setSelectedStatus(entry.status);
                    }
                }
            })
            .catch((cause: unknown) => {
                if (!cancelled && !(cause instanceof ApiError && cause.status === 401)) {
                    console.error("Could not check game library status:", cause);
                    setLibraryError("Could not check your library. Please try again.");
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLibraryLoaded(true);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [gameId]);

    // Bruk PATCH for et spill som eies, ellers legg spillet til med valgt status.
    const handleSaveStatus = async () => {
        if (!game) {
            setStatusError("Game details are not loaded.");
            return;
        }

        setSavingStatus(true);
        setStatusError(null);
        setStatusMessage(null);

        try {
            if (isInLibrary) {
                const result = await updateGameLibraryStatus(game.id, selectedStatus);
                if (!result.ok) {
                    throw new ApiError(result.status, result.message);
                }
            } else {
                const result = await addGameToLibrary(game, selectedStatus);
                if (!result.ok) {
                    throw new ApiError(result.status, result.message);
                }
                setIsInLibrary(true);
            }
            setStatusMessage("Library status saved.");
        } catch (cause: unknown) {
            console.error("Could not save library status:", cause);
            setStatusError(
                cause instanceof ApiError && cause.status === 401
                    ? "Log in to save a game to your library."
                    : "Could not save the status. Please try again.",
            );
        } finally {
            setSavingStatus(false);
        }
    };

    const releaseDate = game?.firstReleaseDate
        ? new Intl.DateTimeFormat(undefined, { dateStyle: "long" })
            .format(new Date(game.firstReleaseDate * 1000))
        : "Release date unavailable";

    return (
        <section className="game-info-page">
            <h1 className="game-info-title">Game Info</h1>
            {loading && <p role="status">Loading game details...</p>}
            {error && <p role="alert">{error}</p>}
            {game && (
                <article className="game-info">
                    {/* Vis spilldetaljene og la brukeren lagre bibliotekstatusen. */}
                    {igdbImageUrl(game.coverImageId) && (
                        <img
                            className="game-info-cover"
                            src={igdbImageUrl(game.coverImageId)}
                            alt={`Cover for ${game.name}`}
                        />
                    )}
                    <div className="game-info-details">
                        <h2>{game.name}</h2>
                        <p><strong>Publisher:</strong> {game.publisher ?? "Publisher unavailable"}</p>
                        <p><strong>Release date:</strong> {releaseDate}</p>
                        <div className="filtrer-buttons" aria-label="Choose game status">
                            {statuses.map((status) => (
                                <button
                                    className="filtrer-button"
                                    type="button"
                                    key={status.value}
                                    aria-pressed={selectedStatus === status.value}
                                    onClick={() => {
                                        setSelectedStatus(status.value);
                                        setStatusMessage(null);
                                        setStatusError(null);
                                    }}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                        {libraryError && <p role="alert">{libraryError}</p>}
                        <button
                            className="add-button game-info-save"
                            type="button"
                            onClick={() => void handleSaveStatus()}
                            disabled={!libraryLoaded || savingStatus || Boolean(libraryError)}
                        >
                            {savingStatus
                                ? "Saving..."
                                : isInLibrary
                                    ? "Save status"
                                    : "Add to library"}
                        </button>
                        {statusMessage && <p role="status">{statusMessage}</p>}
                        {statusError && <p role="alert">{statusError}</p>}
                        <h3>Description</h3>
                        <p>{game.summary ?? "No description available."}</p>
                    </div>
                </article>
            )}
        </section>
    );
}
