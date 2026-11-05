import { applyD1Migrations, env, SELF } from "cloudflare:test";
import { beforeAll, describe, expect, it } from "vitest";
import type { D1Migration } from "@cloudflare/vitest-plugin";

declare const __D1_MIGRATIONS__: D1Migration[];

const apiUrl = "http://localhost";

beforeAll(async () => {
    await applyD1Migrations(env.DB, __D1_MIGRATIONS__);
});

async function createTestUser(email: string): Promise<string> {
    const response = await SELF.fetch(`${apiUrl}/api/auth/sign-up/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: `Test ${email}`,
            email,
            password: "TestPassword!123",
        }),
    });

    if (!response.ok) {
        throw new Error(`Test user signup failed: ${response.status} ${await response.text()}`);
    }

    const cookie = response.headers.get("set-cookie")?.split(";", 1)[0];
    if (!cookie) {
        throw new Error("Test user signup did not return a session cookie");
    }
    return cookie;
}

describe("library API integration", () => {
    it("rejects library requests without an authenticated session", async () => {
        const response = await SELF.fetch(`${apiUrl}/api/library`);

        expect(response.status).toBe(401);
        expect(await response.json()).toEqual({ message: "Unauthorized" });
    });

    it("adds, lists, updates, isolates, and removes a user's library game", async () => {
        const id = crypto.randomUUID();
        const userCookie = await createTestUser(`owner-${id}@example.test`);
        const otherUserCookie = await createTestUser(`other-${id}@example.test`);
        const game = {
            igdbGameId: 900000001,
            name: "Integration Test Game",
            coverImageId: "integration-cover",
            status: "planned",
        };

        const addResponse = await SELF.fetch(`${apiUrl}/api/library`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: userCookie,
            },
            body: JSON.stringify(game),
        });

        expect(addResponse.status).toBe(201);
        expect(await addResponse.json()).toMatchObject({
            igdbGameId: game.igdbGameId,
            status: "planned",
            game: {
                id: game.igdbGameId,
                name: game.name,
                coverImageId: game.coverImageId,
            },
        });

        const listResponse = await SELF.fetch(`${apiUrl}/api/library`, {
            headers: { Cookie: userCookie },
        });
        expect(await listResponse.json()).toMatchObject([
            { igdbGameId: game.igdbGameId, status: "planned" },
        ]);

        const otherUserResponse = await SELF.fetch(`${apiUrl}/api/library`, {
            headers: { Cookie: otherUserCookie },
        });
        expect(await otherUserResponse.json()).toEqual([]);

        const updateResponse = await SELF.fetch(
            `${apiUrl}/api/library/${game.igdbGameId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: userCookie,
                },
                body: JSON.stringify({ status: "completed" }),
            },
        );
        expect(updateResponse.status).toBe(200);
        expect(await updateResponse.json()).toMatchObject({
            igdbGameId: game.igdbGameId,
            status: "completed",
        });

        const deleteResponse = await SELF.fetch(
            `${apiUrl}/api/library/${game.igdbGameId}`,
            {
                method: "DELETE",
                headers: { Cookie: userCookie },
            },
        );
        expect(deleteResponse.status).toBe(204);

        const finalListResponse = await SELF.fetch(`${apiUrl}/api/library`, {
            headers: { Cookie: userCookie },
        });
        expect(await finalListResponse.json()).toEqual([]);
    });
});
