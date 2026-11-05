import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IGDBGame, LibraryEntry } from "@backlog-defeater/api-client";
import { SearchResults } from "../../Web/src/app/pages/SearchResults";

const { addGameToLibrary, updateGameLibraryStatus } = vi.hoisted(() => ({
    addGameToLibrary: vi.fn(),
    updateGameLibraryStatus: vi.fn(),
}));

vi.mock("@/lib/library-actions", () => ({
    addGameToLibrary,
    updateGameLibraryStatus,
}));

const game: IGDBGame = {
    id: 42,
    name: "Game & Test",
    coverImageId: "cover-id",
};

describe("Web search-to-library integration", () => {
    beforeEach(() => {
        addGameToLibrary.mockResolvedValue({
            ok: true,
            data: {
                igdbGameId: game.id,
                status: "planned",
                addedAt: "2026-11-05",
                game,
            } satisfies LibraryEntry,
        });
        vi.stubGlobal(
            "fetch",
            vi.fn().mockImplementation((input: RequestInfo | URL) => {
                const url = new URL(String(input));
                if (url.pathname === "/api/games") {
                    return Promise.resolve(
                        new Response(JSON.stringify([game]), {
                            status: 200,
                            headers: { "Content-Type": "application/json" },
                        }),
                    );
                }
                if (url.pathname === "/api/library") {
                    return Promise.resolve(
                        new Response("[]", {
                            status: 200,
                            headers: { "Content-Type": "application/json" },
                        }),
                    );
                }
                throw new Error(`Unexpected API request: ${url.pathname}`);
            }),
        );
    });

    it("searches for a game and adds it to the library", async () => {
        render(<SearchResults query="Game & Test" />);

        expect(await screen.findByRole("heading", { name: game.name, level: 2 })).toBeVisible();
        fireEvent.click(await screen.findByRole("button", { name: "Add to library" }));

        await waitFor(() => {
            expect(addGameToLibrary).toHaveBeenCalledWith(game, "planned");
        });
        expect(await screen.findByRole("button", { name: "Save status" })).toBeVisible();
        expect(screen.getByText(/In your library · Status: Planned/)).toBeInTheDocument();
    });
});
