
//Testdataer for ulike komponenter og sider..

import { Game } from "@/types/game";
import type { IGDBGame, LibraryEntry } from "@backlog-defeater/api-client";

export const TESTDATA: Game[] = [
    {
        id: 1,
        name: 'Harry Potter Open World',
        total_rating: 69.5
    },
    {
        id: 2,
        name: 'GTA 6',
        total_rating: 88.5
    },
    {
        id: 3,
        name: 'FC27',
        total_rating: 79.8
    }
];

//sjekk av continue playing karusellen på home siden
export const TEST_LIBRARY: LibraryEntry[] = [
    {
        id: 1,
        userId: 1,
        IgdbGameId: 1942,
        status: 'playing',
        addedAt: '2026-10-01T12:00:00.000Z',
        game: { id: 1942, name: 'The Witcher 3: Wild Hunt', coverImageId: 'coaarl'}
    },
    {
        id: 2,
        userId: 1,
        IgdbGameId: 119133,
        status: 'playing',
        addedAt: '2026-10-02T12:00:00.000Z',
        game: { id: 119133, name: 'Elden Ring', coverImageId: 'co4jni'}
    },
    {
        id: 3,
        userId: 1,
        IgdbGameId: 408819,
        status: 'playing',
        addedAt: '2026-10-03T12:00:00.000Z',
        game: { id: 408819, name: 'EA Sports FC27', coverImageId: 'coclf3'}
    },
    {
        id: 4,
        userId: 1,
        IgdbGameId: 52189,
        status: 'planned',
        addedAt: '2026-10-04T12:00:00.000Z',
        game: { id: 52189, name: 'Grand Theft Auto VI', coverImageId: 'cocv1v'}
    },
    {
        id: 5,
        userId: 1,
        IgdbGameId: 7346,
        status: 'completed',
        addedAt: '2026-10-05T12:00:00.000Z',
        game: { id: 7346, name: 'The Legend of Zelda: Tears of the Kingdom: Tears of the Kingdom', coverImageId: 'co3p2d'}
    },
    {
        id: 6,
        userId: 1,
        IgdbGameId: 119171,
        status: 'playing',
        addedAt: '2026-10-06T12:00:00.000Z'
    }
];

//test data for søkesiden
//funksjonen som tar imot søket TODO: erstattes med searchGames() fra packages>api-client>src>index
export async function searchTestGames(query: string): Promise<IGDBGame[]> {

    const q = query.trim().toLowerCase();

    if (q === ''){
        return(
            []
        )
    }
    
    return(
        TEST_SEARCH_GAMES.filter(game => 
            game.name.toLowerCase().includes(q)
        )
    )
}

export const TEST_SEARCH_GAMES:  IGDBGame[] = [
    {
        id: 119388,
        name: 'The Legend of Zelda: Tears of the Kingdom',
        coverImageId: 'co3p2d',
        summary: 'An epic adventure across the land and skies of Hyrule awaits in The Legend of Zelda: Tears of the Kingdom: Tears of the Kingdom for Nintendo Switch. The adventure is yours to create in a world fueled by your imagination.'
    },
    {
    id: 1942,
    name: "The Witcher 3: Wild Hunt",
    coverImageId: 'coaarl',
    summary: "Play as Geralt, a monster hunter searching for Ciri.",
    firstReleaseDate: 1431993600,
  },
  {
    id: 1877,
    name: "Cyberpunk 2077",
    coverImageId: 'coaih8',
    summary: "An open-world RPG set in the futuristic Night City.",
    firstReleaseDate: 1607558400,
  },
  {
    id: 112875,
    name: "God of War Ragnarök",
    coverImageId: 'coba3d',
    summary: "Kratos and Atreus journey through the Nine Realms.",
    firstReleaseDate: 1667952000,
  },
  {
    id: 14593,
    name: "Hollow Knight",
    coverImageId: 'cobfzp',
    summary: "Explore a mysterious underground kingdom.",
    firstReleaseDate: 1487894400,
  },
];


//funksjon for for henting av spillinfo på infosiden
//TODO: en lignende funksjon må opprettes i api-client!!
export async function getTestGameById(id: number): Promise<IGDBGame | null> {

    const found = TEST_SEARCH_GAMES.find(game => game.id === id);

    return(
        found ?? null
    )

};