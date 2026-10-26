
//for testing av top-game side-scoll card..

import { Game } from "@/types/game";
import type { LibraryEntry } from "@backlog-defeater/api-client";

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
]

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
        game: { id: 7346, name: 'The Legend of Zelda', coverImageId: 'co3p2d'}
    },
    {
        id: 6,
        userId: 1,
        IgdbGameId: 119171,
        status: 'playing',
        addedAt: '2026-10-06T12:00:00.000Z'
    }
]