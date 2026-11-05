import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, createApiClient } from "@backlog-defeater/api-client";

describe("shared API client service", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("encodes search queries and parses the API response", async () => {
        const fetchMock = vi.fn().mockResolvedValue(
            new Response(
                JSON.stringify([{ id: 42, name: "Game & Test", coverImageId: "cover-id" }]),
                { status: 200, headers: { "Content-Type": "application/json" } },
            ),
        );
        vi.stubGlobal("fetch", fetchMock);

        const games = await createApiClient("http://api.test").searchGames("Game & Test");

        expect(fetchMock).toHaveBeenCalledWith(
            "http://api.test/api/games?search=Game%20%26%20Test",
            { headers: { "Content-Type": "application/json" } },
        );
        expect(games).toEqual([{ id: 42, name: "Game & Test", coverImageId: "cover-id" }]);
    });

    it("returns API status and message in an ApiError", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue(
                new Response(JSON.stringify({ message: "Unauthorized" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                }),
            ),
        );

        const request = createApiClient("http://api.test").getLibrary();
        await expect(request).rejects.toBeInstanceOf(ApiError);
        await expect(request)
            .rejects.toMatchObject({ status: 401, message: "Unauthorized" });
    });
});
