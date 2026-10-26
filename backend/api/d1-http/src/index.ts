/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// 

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

type Bindings = {
	DB: D1Database;
	IGDB_CLIENT_ID: string;
	IGDB_CLIENT_SECRET: string;
};

// Opprette APIet med types for workers
const app = new Hono<{ Bindings: Bindings }>();

// Logger HTTP kall med types og formaterer JSON svar
app.use("*", prettyJSON(), logger());

// Lar web-appen lese API svar fra nettleser
app.use("/api/*", cors({
	origin: "http://localhost:5173",
	allowMethods: ["GET", "OPTIONS"],
	allowHeaders: ["Content-Type"],
}),
);

// Tokenfelter Twitch returnerer
type TwitchTokenResponse = {
	access_token: string;
	expires_in: number;
};

// Spillfelter AOUet ber IGDB returnere
type IgdbGameResponse = {
	id: number;
	name: string;
	summary?: string;
	first_release_date?: number;
	cover?: {
		image_id?: string;
	} | null;
};

// Holder token i minnet mellom kall når samme Worker gjenbrukes
let cachedToken: { value: string, expiresAt: number } | undefined;

// Henter nytt Twitch-token hvis det trengs, ellers gjenbruker gyldig token
async function getAccessToken(env: Bindings): Promise<string> {
	// Hvis token har minst ett minutt igjen, gjenbruk
	if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
		return cachedToken.value;
	}

	// Lager Twitchs OAuth-URL med Workerens private credentials
	const tokenUrl = new URL("https://id.twitch.tv/oauth2/token");
	tokenUrl.searchParams.set("client_id", env.IGDB_CLIENT_ID);
	tokenUrl.searchParams.set("client_secret", env.IGDB_CLIENT_SECRET);
	tokenUrl.searchParams.set("grant_type", "client_credentials");

	// Ber twitcvh om ny app token hvis nødvendig
	const response = await fetch(tokenUrl, {method: "POST"});

	// Stopper hvis Twitch ikke godtar credentials den får
	if (!response.ok) {
		console.error("Twitch token request failed:", response.status);
		throw new Error("Could not get Twitch access token");
	}

	// Leser token som Twitch returnerer
	const token = (await response.json()) as TwitchTokenResponse;

	// LAgrer token som Twitch returnerte
	cachedToken = {
		value: token.access_token,
		expiresAt: Date.now() + token.expires_in * 1_000,
	};

	// Gir token tilbake til search route
	return token.access_token
}

// Håndterer GET /api/games?search=Hades fra Web eller Mobile (bare så jeg kan teste)
app.get("/api/games", async (c) => {
	// Leser søk fra URL og fjerner mellomrom rundt teksten
	const search = c.req.query("search")?.trim();

	// returnerer HTTP 400 hvis søkeord mangler
	if (!search) {
		return c.json({message: "Search text is required"}, 400);
	}

	// ikke tillat unormalt lange søk
	if (search.length > 80) {
		return c.json({message: "Search text is too long"}, 400);
	}

	// Sjekker om Twitch credentials er konfigurert uten å logge verdiene
	if (!c.env.IGDB_CLIENT_ID || !c.env.IGDB_CLIENT_SECRET) {
		console.error("IGDB credentials are missing");
		return c.json({message: "Game search is not configured"}, 500);
	}

	// escaper tegn som kan tulle med IGDBs søketekst
	const escapedSearch = search.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

	// Ber IGDB om nødvendige felt og setter resultatgrensa til 30
	const igdbQuery = `fields id,name,summary,first_release_date,cover.image_id; ` + `search "${escapedSearch}"; ` + "limit 30;";

	try {
		// henter et gyldig Twitch token for IGDB kallet
		const accessToken = await getAccessToken(c.env);

		// søker på IGDB fra server, så credentials ikke går til nettleseren
		const response = await fetch("https://api.igdb.com/v4/games", {
			method: "POST",
			headers: {
				"Client-ID": c.env.IGDB_CLIENT_ID,
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "text/plain",
			},
			body: igdbQuery,
		});

		// Reporter IGDB feil som en gateway feil til client
		if (!response.ok) {
			console.error("IGDB search failed: ", response.status);
			return c.json({message: "Game search provider failed"}, 502);
		}

		// Leser spillene IGDB returnerte
		const games = (await response.json()) as IgdbGameResponse[];

		// Mapper IGDB-feltene til den delte api-client-typen
		const results = games.map((game) => ({
			id: game.id,
			name: game.name,
			summary: game.summary,
			firstReleaseDate: game.first_release_date,
			coverImageId: game.cover?.image_id,
		}));

		// Returnerer resultatene til Web eller Mobile
		return c.json(results);
	} catch(error) {
		// Logger årsak på server uten å vise credentials til klient
		console.error("Game search request failed: ", error);
		return c.json({message: "Unable to search games"}, 502);
	}
});

// Gjør appen (Hono) tilgjengelig for Wrangler
export default app;



