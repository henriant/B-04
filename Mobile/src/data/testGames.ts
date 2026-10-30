
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
        IgdbGameId: 119388,
        status: 'completed',
        addedAt: '2026-10-05T12:00:00.000Z',
        game: { id: 119388, name: 'The Legend of Zelda: Tears of the Kingdom', coverImageId: 'co3p2d'}
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
        TEST_GAMES.filter(game => 
            game.name.toLowerCase().includes(q)
        )
    )
}

export const TEST_GAMES:  IGDBGame[] = [
    {
        id: 119388,
        name: 'The Legend of Zelda: Tears of the Kingdom',
        coverImageId: 'co3p2d',
        summary: 'An epic adventure across the land and skies of Hyrule awaits in The Legend of Zelda: Tears of the Kingdom for Nintendo Switch. The adventure is yours to create in a world fueled by your imagination.'
    },
    {
    id: 1942,
    name: "The Witcher 3: Wild Hunt",
    coverImageId: 'coaarl',
    summary: "The Witcher 3: Wild Hunt is an open-world action role-playing game developed by CD Projekt Red. Set in a dark fantasy world, the game follows Geralt of Rivia, a monster hunter searching for his adopted daughter, Ciri, while navigating political conflicts and supernatural threats. Gameplay features exploration, combat, character progression, and branching narratives shaped by player choices. Widely acclaimed for its writing, world-building, and depth, it is considered one of the most influential RPGs of its generation.",
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
  {
    id: 25076,
    name: "Red Dead Redemption 2",
    coverImageId: "co1q1f",
    summary: "An open-world western adventure following Arthur Morgan and the Van der Linde gang as they struggle to survive in a changing America.",
    firstReleaseDate: 1540512000,
  },
  {
    id: 110248,
    name: "Stray",
    coverImageId: "co4tt2",
    summary: "Play as a lost stray cat exploring a mysterious cybercity filled with robots, solving puzzles and uncovering ancient secrets.",
    firstReleaseDate: 1658188800,
  },
  {
    id: 251833,
    name: "Balatro",
    coverImageId: "co9f4g",
    summary: "A poker-inspired roguelike deck-building game where players combine cards, powerful Jokers and unique strategies to win.",
    firstReleaseDate: 1708387200,
  },
  {
    id: 26226,
    name: "Celeste",
    coverImageId: "cob9dh",
    summary: "Help Madeline climb Celeste Mountain in a challenging platform adventure about overcoming obstacles and personal struggles.",
    firstReleaseDate: 1516838400,
  },
  {
    id: 103329,
    name: "Control",
    coverImageId: "co2evj",
    summary: "A supernatural action-adventure where Jesse Faden explores a mysterious government agency invaded by an otherworldly force.",
    firstReleaseDate: 1566864000,
  },
  {
    id: 119133,
    name: "Elden Ring",
    coverImageId: "co4jni",
    summary: "An open-world action RPG set in the Lands Between. Explore dangerous dungeons, defeat powerful enemies and become the Elden Lord.",
    firstReleaseDate: 1645747200,
  },
  {
    id: 408819,
    name: "EA Sports FC 27",
    coverImageId: 'coclf3',
    summary: "Experience The World's Game with new football gameplay innovations, exciting game modes and The Grounds, where street football meets the stadium.",
    firstReleaseDate: 1790294400,
  },
  {
    id: 52189,
    name: "Grand Theft Auto VI",
    coverImageId: 'cocv1v',
    summary: "Explore the state of Leonida and the neon-soaked streets of Vice City in an open-world crime adventure following Jason and Lucia.",
    firstReleaseDate: 1795046400,
  },
  {
    id: 119171,
    name: "Baldur's Gate III",
    coverImageId: 'co670h',
    summary: "A story-rich fantasy RPG set in the world of Dungeons & Dragons. Gather your party, make meaningful choices and shape the fate of Faerûn.",
    firstReleaseDate: 1691020800,
  },
];


//funksjon for for henting av spillinfo på infosiden
//TODO: en lignende funksjon må opprettes i api-client!!
export async function getTestGameById(id: number): Promise<IGDBGame | null> {

    const found = TEST_GAMES.find(game => game.id === id);

    return(
        found ?? null
    )

};