import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LibraryList } from "../../Web/src/components/userComponents/LibraryList";

vi.mock("@/lib/library-actions", () => ({
    removeGameFromLibrary: vi.fn(),
}));

describe("LibraryList component", () => {
    beforeEach(() => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue(
                new Response(
                    JSON.stringify([
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
                    ]),
                    { status: 200, headers: { "Content-Type": "application/json" } },
                ),
            ),
        );
    });

    it("loads the library and displays entries matching the selected status", async () => {
        render(<LibraryList query="" status="playing" />);

        expect(await screen.findByRole("heading", { name: "Hades", level: 2 })).toBeVisible();
        expect(screen.queryByRole("heading", { name: "Stardew Valley", level: 2 })).toBeNull();
        expect(screen.getByRole("link", { name: /Hades/ })).toHaveAttribute(
            "href",
            "/GameInfo?id=1",
        );
    });
});
