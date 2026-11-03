import { ApiError, IGDBGame, LibraryEntry, LibraryStatus } from "./types";
import { UserLoginInput, UserSignupInput } from "./schemas";
import { z } from "zod";
import { registerUserSchema, loginUserSchema, igdbGameSchema, libraryEntrySchema, libraryStatusSchema } from "./schemas";
export * from "./schemas";
export * from "./types";


export function igdbImageUrl(
    imageId?: string, size: 't_thumb' | 't_cover_small' | 't_cover_big' | 't_720p' | 't_1080p' = 't_cover_big'
): string {
    if (!imageId) return "";
    return `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg`; // Fallback bilde dersom imageId er undefined eller ikke eksisterer
}

function getErrorMessage(data: unknown, fallback: string): string {
    if (typeof data === "object" && data !== null && "message" in data && typeof data.message === "string") {
        return data.message;
    }
    return fallback;
}

async function parseResponse<T>(
    response: Response,
    schema: z.ZodType<T>,
    fallbackMessage: string,
): Promise<T> {
    const data: unknown = await response.json().catch(() => null);
    if (!response.ok) {
        throw new ApiError(
            response.status,
            getErrorMessage(data, fallbackMessage)
        )
    }
    return schema.parse(data);
}

export function createApiClient (
    baseUrl: string,
    getToken?: () => Promise<string | null> | string | null
) {
    // Lage headers med bruker-token om den finns
    async function getHeaders() {
        const headers: Record <string, string> = {
            "Content-Type" : "application/json",
        };

        if (getToken) {
            const token = await getToken();
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    return {
        async register(input: UserSignupInput) {
            const res = await fetch(`${baseUrl}/api/auth/signup`, {
                method: "POST",
                headers: await getHeaders(),
                body: JSON.stringify(input),
            });

            return parseResponse(
                res,
                z.unknown(),
                "Error while signing up",
            );
        },

        async login(input: UserLoginInput) {
            const res = await fetch(`${baseUrl}/api/auth/login`, {
                method: "POST",
                headers: await getHeaders(),
                body: JSON.stringify(input),
            });

            return parseResponse(
                res,
                z.unknown(),
                "Error while logging in",
            );
        },

        async searchGames(query: string): Promise<IGDBGame[]> {
            const res = await fetch(
                `${baseUrl}/api/games?search=${encodeURIComponent(query)}`,
                {
                    headers: await getHeaders(),
                },
            );

            return parseResponse(
                res,
                z.array(igdbGameSchema),
                "Game search failed",
            );
        },

        async getGame(igdbGameId: number): Promise<IGDBGame> {
            const res = await fetch(`${baseUrl}/api/games/${igdbGameId}`, {
                headers: await getHeaders(),
            });

            return parseResponse(
                res,
                igdbGameSchema,
                "Could not load game details",
            );
        },

        async getLibrary(): Promise<LibraryEntry[]> {
            const res = await fetch(`${baseUrl}/api/library`, {
                headers: await getHeaders(),
                // Send Better Auth-cookien med, slik at serveren vet hvem brukeren er.
                credentials: "include",
            });

            return parseResponse(
                res,
                z.array(libraryEntrySchema),
                "Error while fetching your library",
            );
        },

        async addToLibrary(
            game: IGDBGame,
            status: LibraryStatus = "planned",
        ): Promise<LibraryEntry> {
            const res = await fetch(`${baseUrl}/api/library`, {
                method: "POST",
                headers: await getHeaders(),
                credentials: "include",
                // Send spill-ID, navn, cover og status til bibliotek-API-et.
                body: JSON.stringify({
                    igdbGameId: game.id,
                    name: game.name,
                    coverImageId: game.coverImageId,
                    status,
                }),
            });

            return parseResponse(
                res,
                libraryEntrySchema,
                "Could not add to library",
            );
        },

        async updateLibraryStatus(
            igdbGameId: number,
            status: LibraryStatus,
        ): Promise<LibraryEntry> {
            const res = await fetch(`${baseUrl}/api/library/${igdbGameId}`, {
                method: "PATCH",
                headers: await getHeaders(),
                credentials: "include",
                // Send den nye statusen til serveren for lagring.
                body: JSON.stringify({ status }),
            });

            return parseResponse(
                res,
                libraryEntrySchema,
                "Could not update status",
            );
        },

        async removeFromLibrary(igdbGameId: number): Promise<void> {
            const res = await fetch(`${baseUrl}/api/library/${igdbGameId}`, {
                method: "DELETE",
                headers: await getHeaders(),
                // Send innloggingscookien, så serveren sletter bare fra riktig bibliotek.
                credentials: "include",
            });

            if (!res.ok) {
                const data: unknown = await res.json().catch(() => null);

                throw new ApiError(
                    res.status,
                    getErrorMessage(data, "Could not delete from library"),
                );
            }
        },
    };
};