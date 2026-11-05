import { describe, expect, it } from "vitest";
import type { LibraryEntry } from "@backlog-defeater/api-client";
import { filterLibraryEntries } from "../../Web/src/lib/library-filter";

const entries: LibraryEntry[] = [
    {
        igdbGameId: 1,
        status: "playing",
        addedAt: "2026-11-05",
        game: { id: 1, name: "Hades" },
    },
    {
        igdbGameId: 2,
        status: "completed",
        addedAt: "2026-11-05",
        game: { id: 2, name: "Stardew Valley" },
    },
];

describe("filterLibraryEntries", () => {
    it("filters by case-insensitive game name and status", () => {
        expect(filterLibraryEntries(entries, "  HAD  ", "playing")).toEqual([entries[0]]);
        expect(filterLibraryEntries(entries, "", "completed")).toEqual([entries[1]]);
    });

    it("returns all entries when no name or status filter is selected", () => {
        expect(filterLibraryEntries(entries, "", "all")).toEqual(entries);
    });
});
