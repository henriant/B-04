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

type LibraryStatus = "planned" | "playing" | "completed";

type IgdbGameResponse = {
	id: number;
	name: string;
	summary?: string | null;
	first_release_date?: number | null;
	involved_companies?: {
		publisher?: boolean | null;
		company?: {
			name?: string | null;
		} | null;
	}[] | null;
	cover?: {
		image_id?: string | null;
	} | null;
};

type LibraryEntryRow = {
	igdbGameId: number;
	status: LibraryStatus;
	addedAt: string;
	gameName: string;
	coverImageId: string | null;
};

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
		return c.json({ message: "Search text is required" }, 400);
	}
	if (search.length > 80) {
		return c.json({ message: "Search text is too long" }, 400);
	}
	if (!c.env.IGDB_CLIENT_ID || !c.env.IGDB_CLIENT_SECRET) {
		console.error("IGDB credentials are missing");
		return c.json({ message: "Game search is not configured" }, 500);
	}

	try {
		const accessToken = await getAccessToken(c.env);
		const response = await fetch("https://api.igdb.com/v4/games", {
			method: "POST",
			headers: {
				"Client-ID": c.env.IGDB_CLIENT_ID,
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "text/plain",
			},
			body: `fields id,name,summary,first_release_date,cover.image_id,involved_companies.publisher,involved_companies.company.name; search "${escapeIgdbString(search)}"; limit 30;`,
		});

		if (!response.ok) {
			console.error("IGDB search failed:", response.status);
			return c.json({ message: "Game search provider failed" }, 502);
		}

		const games = (await response.json()) as IgdbGameResponse[];
		return c.json(games.map(mapIgdbGame));
	} catch (cause: unknown) {
		console.error("Game search request failed:", cause);
		return c.json({ message: "Unable to search games" }, 502);
	}
});

app.get("/api/games/:id", async (c) => {
	const id = Number(c.req.param("id"));
	if (!Number.isSafeInteger(id) || id <= 0) {
		return c.json({ message: "Invalid game ID" }, 400);
	}
	if (!c.env.IGDB_CLIENT_ID || !c.env.IGDB_CLIENT_SECRET) {
		console.error("IGDB credentials are missing");
		return c.json({ message: "Game search is not configured" }, 500);
	}

	try {
		const accessToken = await getAccessToken(c.env);
		const response = await fetch("https://api.igdb.com/v4/games", {
			method: "POST",
			headers: {
				"Client-ID": c.env.IGDB_CLIENT_ID,
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "text/plain",
			},
			body: `fields id,name,summary,first_release_date,cover.image_id,involved_companies.publisher,involved_companies.company.name; where id = ${id};`,
		});

		if (!response.ok) {
			console.error("IGDB game details request failed:", response.status);
			return c.json({ message: "Game details provider failed" }, 502);
		}

		const [game] = (await response.json()) as IgdbGameResponse[];
		if (!game) {
			return c.json({ message: "Game not found" }, 404);
		}
		return c.json(mapIgdbGame(game));
	} catch (cause: unknown) {
		console.error("IGDB game details request failed:", cause);
		return c.json({ message: "Unable to load game details" }, 502);
	}
});

app.get("/api/library", async (c) => {
	const auth = createAuth(c.env, c.req.url);
	const session = await auth.api.getSession({ headers: c.req.raw.headers });
	if (!session) {
		return c.json({ message: "Unauthorized" }, 401);
	}

	const libraryId = await ensureUserLibraryId(c.env.DB, session.user.id);
	const result = await c.env.DB.prepare(
		// TODO CHANGE THIS INTO DRIZZLE SCHEMA CALL
		`SELECT game.id AS igdbGameId,
		       library_game.status AS status,
		       library_game.addedAt AS addedAt,
		       game.name AS gameName,
		       game.coverImage AS coverImageId
		FROM library_game
		JOIN game ON game.id = library_game.game_id
		WHERE library_game.library_id = ?
		ORDER BY game.name
	`)
		.bind(libraryId)
		.all<LibraryEntryRow>();

	return c.json(result.results.map(mapLibraryEntry));
});

app.post("/api/library", async (c) => {
	const auth = createAuth(c.env, c.req.url);
	const session = await auth.api.getSession({ headers: c.req.raw.headers });
	if (!session) {
		return c.json({ message: "Unauthorized" }, 401);
	}

	const body: unknown = await c.req.json().catch(() => null);
	if (
		typeof body !== "object" ||
		body === null ||
		Array.isArray(body) ||
		!("igdbGameId" in body) ||
		typeof body.igdbGameId !== "number" ||
		!Number.isSafeInteger(body.igdbGameId) ||
		body.igdbGameId <= 0 ||
		!("name" in body) ||
		typeof body.name !== "string" ||
		body.name.trim().length === 0
	) {
		return c.json({ message: "A valid game ID and name are required" }, 400);
	}

	const coverImageId =
		"coverImageId" in body && typeof body.coverImageId === "string"
			? body.coverImageId
			: null;
	const status =
		"status" in body && body.status !== undefined ? body.status : "planned";
	if (
		("coverImageId" in body &&
			body.coverImageId !== undefined &&
			body.coverImageId !== null &&
			typeof body.coverImageId !== "string") ||
		!isLibraryStatus(status)
	) {
		return c.json({ message: "Invalid game details or library status" }, 400);
	}

	const libraryId = await ensureUserLibraryId(c.env.DB, session.user.id);
	await c.env.DB.prepare(
		// TODO CHANGE THIS INTO DRIZZLE SCHEMA CALL
		`INSERT INTO game (id, name, coverImage)
		VALUES (?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			name = excluded.name,
			coverImage = COALESCE(excluded.coverImage, game.coverImage)
	`)
		.bind(body.igdbGameId, body.name.trim(), coverImageId)
		.run();
	await c.env.DB.prepare(
		// TODO CHANGE THIS INTO DRIZZLE SCHEMA CALL
		`INSERT INTO library_game (library_id, game_id, status)
		VALUES (?, ?, ?)
		ON CONFLICT(library_id, game_id) DO NOTHING
	`)
		.bind(libraryId, body.igdbGameId, status)
		.run();

	const entry = await getLibraryEntry(c.env.DB, libraryId, body.igdbGameId);
	if (!entry) {
		throw new Error("Added library entry could not be loaded from D1");
	}
	return c.json(mapLibraryEntry(entry), 201);
});

app.patch("/api/library/:gameId", async (c) => {
	const auth = createAuth(c.env, c.req.url);
	const session = await auth.api.getSession({ headers: c.req.raw.headers });
	if (!session) {
		return c.json({ message: "Unauthorized" }, 401);
	}

	const gameId = Number(c.req.param("gameId"));
	if (!Number.isSafeInteger(gameId) || gameId <= 0) {
		return c.json({ message: "Invalid game ID" }, 400);
	}

	const body: unknown = await c.req.json().catch(() => null);
	const status =
		typeof body === "object" && body !== null && "status" in body
			? body.status
			: null;
	if (!isLibraryStatus(status)) {
		return c.json({ message: "Invalid library status" }, 400);
	}

	const libraryId = await ensureUserLibraryId(c.env.DB, session.user.id);
	const result = await c.env.DB.prepare(
		"UPDATE library_game SET status = ? WHERE library_id = ? AND game_id = ?",
	)
		.bind(status, libraryId, gameId)
		.run();
	if (result.meta.changes === 0) {
		return c.json({ message: "Game not found in your library" }, 404);
	}

	const entry = await getLibraryEntry(c.env.DB, libraryId, gameId);
	if (!entry) {
		throw new Error("Updated library entry could not be loaded from D1");
	}
	return c.json(mapLibraryEntry(entry));
});

app.delete("/api/library/:gameId", async (c) => {
	const auth = createAuth(c.env, c.req.url);
	const session = await auth.api.getSession({ headers: c.req.raw.headers });
	if (!session) {
		return c.json({ message: "Unauthorized" }, 401);
	}

	const gameId = Number(c.req.param("gameId"));
	if (!Number.isSafeInteger(gameId) || gameId <= 0) {
		return c.json({ message: "Invalid game ID" }, 400);
	}

	const libraryId = await ensureUserLibraryId(c.env.DB, session.user.id);
	const result = await c.env.DB.prepare(
		"DELETE FROM library_game WHERE library_id = ? AND game_id = ?",
	)
		.bind(libraryId, gameId)
		.run();
	if (result.meta.changes === 0) {
		return c.json({ message: "Game not found in your library" }, 404);
	}
	return c.body(null, 204);
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
		console.error("Twitch token request failed:", response.status);
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

function mapIgdbGame(game: IgdbGameResponse) {
	const publisher = game.involved_companies?.find(
		(company) => company.publisher,
	)?.company?.name;
	return {
		id: game.id,
		name: game.name,
		...(typeof game.summary === "string" ? { summary: game.summary } : {}),
		...(typeof game.first_release_date === "number"
			? { firstReleaseDate: game.first_release_date }
			: {}),
		...(typeof game.cover?.image_id === "string"
			? { coverImageId: game.cover.image_id }
			: {}),
		...(typeof publisher === "string" ? { publisher } : {}),
	};
}

function isLibraryStatus(value: unknown): value is LibraryStatus {
	return value === "planned" || value === "playing" || value === "completed";
}

async function getLibraryEntry(
	db: D1Database,
	libraryId: number,
	gameId: number,
): Promise<LibraryEntryRow | null> {
	return db.prepare(`
		SELECT game.id AS igdbGameId,
		       library_game.status AS status,
		       library_game.addedAt AS addedAt,
		       game.name AS gameName,
		       game.coverImage AS coverImageId
		FROM library_game
		JOIN game ON game.id = library_game.game_id
		WHERE library_game.library_id = ? AND library_game.game_id = ?
	`)
		.bind(libraryId, gameId)
		.first<LibraryEntryRow>();
}

function mapLibraryEntry(entry: LibraryEntryRow) {
	return {
		igdbGameId: entry.igdbGameId,
		status: entry.status,
		addedAt: entry.addedAt,
		game: {
			id: entry.igdbGameId,
			name: entry.gameName,
			...(entry.coverImageId ? { coverImageId: entry.coverImageId } : {}),
		},
	};
}
