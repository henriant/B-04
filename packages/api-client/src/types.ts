// Standard typer vi kan bruke for å fetche fra IGDB gjennom hele prosjektet, som gjør ting enklere for oss.

// Different categories for each game in users library, based on if the user is planning to play, is playing, or has completed a game:
export type LibraryStatus = "planned" | "playing" | "completed";

// Type for game-struktur
export type IGDBGame = {
    id: number;
    name: string;
    coverImageId?: string;
    summary?: string;
    firstReleaseDate?: number;
};

// Typr for brukerens egne library-spill
export type LibraryEntry = {
    id: number;
    userId: number;
    IgdbGameId: number;
    status: LibraryStatus;
    addedAt: string;
    game?: IGDBGame;
};

// Feilklasse som gir feilmelding med HTTP-statuskoide
export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "ApiError";
    }
}