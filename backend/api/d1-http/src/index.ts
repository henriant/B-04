import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { createAuth } from "./auth.js";
import { ensureUserLibraryId } from "./library.js";

export interface Bindings {
	DB: D1Database;
	BETTER_AUTH_SECRET: string;
	BETTER_AUTH_URL?: string;
	IGDB_CLIENT_ID: string;
	IGDB_CLIENT_SECRET: string;
}

type GameRow = {
	id: number;
	name: string;
	summary?: string;
	first_release_date?: number;
	cover?: { image_id: string };
};

type LibraryStatus = "planned" | "playing" | "completed";

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", logger());
app.use("*", prettyJSON());
app.use(
	"*",
	cors({
		origin: ["http://localhost:5174", "http://localhost:8081"],
		allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.get("/", (c) => c.text("d1-http API"));

app.all("/api/auth/*", (c) =>
	createAuth(c.env, c.req.url).handler(c.req.raw),
);

app.get("/api/games", async (c) => {
	const search = c.req.query("search")?.trim();
	if (!search) {
		return c.json({ error: "Search query is required" }, 400);
	}
	if (search.length > 80) {
		return c.json({ error: "Search query must be 80 characters or fewer" }, 400);
	}

	try {
		const token = await getAccessToken(c.env);
		const response = await fetch("https://api.igdb.com/v4/games", {
			method: "POST",
			headers: {
				"Client-ID": c.env.IGDB_CLIENT_ID,
				Authorization: `Bearer ${token}`,
				"Content-Type": "text/plain",
			},
			body: `search "${escapeIgdbString(search)}"; fields id,name,summary,first_release_date,cover.image_id; limit 30;`,
		});

		if (!response.ok) {
			console.error("IGDB request failed:", response.status);
			return c.json({ error: "IGDB request failed" }, 502);
		}

		const games = (await response.json()) as GameRow[];
		return c.json(
			games.map((game) => ({
				id: game.id,
				name: game.name,
				...(typeof game.summary === "string"
					? { summary: game.summary }
					: {}),
				...(typeof game.first_release_date === "number"
					? { firstReleaseDate: game.first_release_date }
					: {}),
				...(typeof game.cover?.image_id === "string"
					? { coverImageId: game.cover.image_id }
					: {}),
			})),
		);
	} catch (cause: unknown) {
		console.error("Game search failed:", cause);
		return c.json({ error: "Game search is temporarily unavailable" }, 502);
	}
});

app.get("/api/library", async (c) => {
	const auth = createAuth(c.env, c.req.url);
	const authSession = await auth.api.getSession({ headers: c.req.raw.headers });
	if (!authSession) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const libraryId = await ensureUserLibraryId(c.env.DB, authSession.user.id);
	const result = await c.env.DB.prepare(
		`SELECT game.id AS igdbGameId, library_game.status, library_game.addedAt,
		        game.id AS gameId, game.name
		 FROM library_game
		 JOIN game ON game.id = library_game.game_id
		 WHERE library_game.library_id = ?
		 ORDER BY game.name`,
	)
		.bind(libraryId)
		.all<{
			igdbGameId: number;
			status: LibraryStatus;
			addedAt: string;
			gameId: number;
			name: string;
		}>();

	return c.json(
		result.results.map(({ igdbGameId, status, addedAt, gameId, name }) => ({
			igdbGameId,
			status,
			addedAt,
			game: { id: gameId, name },
		})),
	);
});

app.post("/api/library", async (c) => {
	const auth = createAuth(c.env, c.req.url);
	const authSession = await auth.api.getSession({ headers: c.req.raw.headers });
	if (!authSession) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const body: unknown = await c.req.json().catch(() => null);
	if (
		typeof body !== "object" ||
		body === null ||
		!("igdbGameId" in body) ||
		typeof body.igdbGameId !== "number" ||
		!Number.isSafeInteger(body.igdbGameId) ||
		body.igdbGameId <= 0 ||
		!("name" in body) ||
		typeof body.name !== "string" ||
		body.name.trim().length === 0
	) {
		return c.json({ error: "A game id and name are required" }, 400);
	}
	const status =
		"status" in body && body.status !== undefined ? body.status : "planned";
	if (!isLibraryStatus(status)) {
		return c.json({ error: "Invalid library status" }, 400);
	}

	const libraryId = await ensureUserLibraryId(c.env.DB, authSession.user.id);
	await c.env.DB.prepare(
		"INSERT INTO game (id, name) VALUES (?, ?) ON CONFLICT(id) DO NOTHING",
	)
		.bind(body.igdbGameId, body.name.trim())
		.run();
	await c.env.DB.prepare(
		"INSERT INTO library_game (library_id, game_id, status) VALUES (?, ?, ?) ON CONFLICT(library_id, game_id) DO NOTHING",
	)
		.bind(libraryId, body.igdbGameId, status)
		.run();

	const entry = await c.env.DB.prepare(
		`SELECT game.id AS igdbGameId, library_game.status, library_game.addedAt,
		        game.id AS gameId, game.name
		 FROM library_game
		 JOIN game ON game.id = library_game.game_id
		 WHERE library_game.library_id = ? AND library_game.game_id = ?`,
	)
		.bind(libraryId, body.igdbGameId)
		.first<{
			igdbGameId: number;
			status: LibraryStatus;
			addedAt: string;
			gameId: number;
			name: string;
		}>();
	if (!entry) {
		throw new Error("Added library entry could not be loaded from D1");
	}

	return c.json(
		{
			igdbGameId: entry.igdbGameId,
			status: entry.status,
			addedAt: entry.addedAt,
			game: { id: entry.gameId, name: entry.name },
		},
		201,
	);
});

app.patch("/api/library/:gameId", async (c) => {
	const auth = createAuth(c.env, c.req.url);
	const authSession = await auth.api.getSession({ headers: c.req.raw.headers });
	if (!authSession) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const gameId = Number(c.req.param("gameId"));
	if (!Number.isSafeInteger(gameId) || gameId <= 0) {
		return c.json({ error: "Invalid game id" }, 400);
	}

	const body: unknown = await c.req.json().catch(() => null);
	const status =
		typeof body === "object" && body !== null && "status" in body
			? body.status
			: null;
	if (!isLibraryStatus(status)) {
		return c.json({ error: "Invalid library status" }, 400);
	}

	const libraryId = await ensureUserLibraryId(c.env.DB, authSession.user.id);
	const result = await c.env.DB.prepare(
		"UPDATE library_game SET status = ? WHERE library_id = ? AND game_id = ?",
	)
		.bind(status, libraryId, gameId)
		.run();
	if (result.meta.changes === 0) {
		return c.json({ error: "Game not found in library" }, 404);
	}

	const entry = await c.env.DB.prepare(
		`SELECT game.id AS igdbGameId, library_game.status, library_game.addedAt,
		        game.id AS gameId, game.name
		 FROM library_game
		 JOIN game ON game.id = library_game.game_id
		 WHERE library_game.library_id = ? AND library_game.game_id = ?`,
	)
		.bind(libraryId, gameId)
		.first<{
			igdbGameId: number;
			status: LibraryStatus;
			addedAt: string;
			gameId: number;
			name: string;
		}>();
	if (!entry) {
		throw new Error("Updated library entry could not be loaded from D1");
	}

	return c.json({
		igdbGameId: entry.igdbGameId,
		status: entry.status,
		addedAt: entry.addedAt,
		game: { id: entry.gameId, name: entry.name },
	});
});

app.delete("/api/library/:gameId", async (c) => {
	const auth = createAuth(c.env, c.req.url);
	const authSession = await auth.api.getSession({ headers: c.req.raw.headers });
	if (!authSession) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const gameId = Number(c.req.param("gameId"));
	if (!Number.isSafeInteger(gameId) || gameId <= 0) {
		return c.json({ error: "Invalid game id" }, 400);
	}

	const libraryId = await ensureUserLibraryId(c.env.DB, authSession.user.id);
	const result = await c.env.DB.prepare(
		"DELETE FROM library_game WHERE library_id = ? AND game_id = ?",
	)
		.bind(libraryId, gameId)
		.run();
	if (result.meta.changes === 0) {
		return c.json({ error: "Game not found in library" }, 404);
	}

	return c.json({ success: true });
});

export default app;

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(env: Bindings): Promise<string> {
	if (cachedToken && Date.now() < tokenExpiresAt) {
		return cachedToken;
	}

	const response = await fetch("https://id.twitch.tv/oauth2/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			client_id: env.IGDB_CLIENT_ID,
			client_secret: env.IGDB_CLIENT_SECRET,
			grant_type: "client_credentials",
		}),
	});
	if (!response.ok) {
		throw new Error(`Twitch token request failed: ${response.status}`);
	}

	const result = (await response.json()) as {
		access_token: string;
		expires_in: number;
	};
	cachedToken = result.access_token;
	tokenExpiresAt = Date.now() + Math.max(result.expires_in - 60, 0) * 1000;
	return cachedToken;
}

function escapeIgdbString(value: string): string {
	return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function isLibraryStatus(value: unknown): value is LibraryStatus {
	return value === "planned" || value === "playing" || value === "completed";
}
