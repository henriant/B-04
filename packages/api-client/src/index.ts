import { ApiError, IGDBGame, LibraryEntry, LibraryStatus } from "./types";
import { UserLoginInput, UserSignupInput } from "./schemas";
export * from "./schemas";
export * from "./types";

export function igdbImageUrl(
    imageId?: string, size: 't_thumb' | 't_cover_small' | 't_cover_big' | 't_720p' | 't_1080p' = 't_cover_big'
): string {
    if (!imageId) return "";
    return `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg`; // Fallback bilde dersom imageId er undefined eller ikke eksisterer
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
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Error while signing up");
            return data;
        },

        async login(input: UserLoginInput) {
            const res = await fetch (`${baseUrl}/api/auth/login`, {
                method: "POST",
                headers: await getHeaders(),
                body: JSON.stringify(input)
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Error while logging in");
            return data; 
        },

        async searchGames(query: string): Promise<IGDBGame[]> {
            const res = await fetch(`${baseUrl}/api/games?search=${encodeURIComponent(query)}`, {
                headers: await getHeaders()
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Game search failed");
            return data; 
        },

        async getLibrary(): Promise<LibraryEntry[]> {
            const res = await fetch(`${baseUrl}/api/library`, {
                headers: await getHeaders(),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Error while fetching your library");
            return data; 
        },

        async addToLibrary(igdbGameId: number, status: LibraryStatus = "planned") : Promise<LibraryEntry> {
            const res = await fetch(`${baseUrl}/api/library`, {
                method: 'POST',
                headers: await getHeaders(),
                body: JSON.stringify({ igdbGameId, status }),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Could not add to library");
            return data; 
        },

        async updateLibraryStatus(id: number, status: LibraryStatus): Promise<LibraryEntry> {
            const res = await fetch(`${baseUrl}/api/library/${id}`, {
                method: "PATCH",
                headers: await getHeaders(),
                body: JSON.stringify({status}),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Could not update status")
            return data;
        },

        async removeFromLibrary(id: number): Promise<void> {
            const res = await fetch(`${baseUrl}/api/library/${id}`, {
                method: "DELETE",
                headers: await getHeaders()
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Could not delete from library")
            }
        }
    };
};