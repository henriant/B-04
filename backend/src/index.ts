import { createAuth } from "./auth.js";

export interface Env {
  Backlog_Binding: D1Database;
}

type LibraryRow = {
  igdbGameId: number;
  status: "planned" | "playing" | "completed";
  addedAt: string;
  gameName: string;
  coverImageId: string | null;
};


// Nettleseren godtar bare API-svar fra webappens lokale origin.
function addCorsHeaders(request: Request, response: Response): Response {
  const headers = new Headers(response.headers);

  const origin = request.headers.get("Origin");
  const allowedOrigin = "http://localhost:5174";

  if (origin === allowedOrigin) {
    headers.set("Access-Control-Allow-Origin", allowedOrigin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    headers.append("Vary", "Origin");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}




export default {
  async fetch(request: Request, env: Env) {
    // Nettleseren sender OPTIONS først for å spørre om API-kallet er tillatt.
    if (request.method === "OPTIONS") {
      return addCorsHeaders(request, new Response(null, { status: 204 }));
    }
    const auth = createAuth(env.Backlog_Binding);
    const url = new URL(request.url);
    const respond = (response: Response) => addCorsHeaders(request, response);

    // Better Auth håndterer innlogging og registrering på disse adressene.
    if (url.pathname === "/api/auth" || url.pathname.startsWith("/api/auth/")) {
      return respond(await auth.handler(request));
    }

    const session = await auth.api.getSession({ headers: request.headers });

    // Bibliotekruter krever en gyldig innloggingsøkt.
    if (!session) {
      return respond(Response.json({ message: "Unauthorized" }, { status: 401 }));
    }


    // Legg til et spill i biblioteket til den innloggede brukeren.
    if (url.pathname === "/api/library" && request.method === "POST") {
      let body: unknown;

      try {
        body = await request.json();
      } catch {
        return respond(Response.json({ message: "Invalid JSON body" }, { status: 400 }));
      }

      if (typeof body !== "object" || body === null || Array.isArray(body)) {
        return respond(Response.json({ message: "Invalid request body" }, { status: 400 }));
      }

      const input = body as {
        igdbGameId?: unknown;
        name?: unknown;
        coverImageId?: unknown;
        status?: unknown;
      };

      if (
        typeof input.igdbGameId !== "number" ||
        !Number.isInteger(input.igdbGameId) ||
        input.igdbGameId <= 0 ||
        typeof input.name !== "string" ||
        input.name.trim().length === 0 ||
        (input.coverImageId !== undefined &&
          input.coverImageId !== null &&
          (typeof input.coverImageId !== "string" || input.coverImageId.trim().length === 0)) ||
        (input.status !== undefined &&
          input.status !== "planned" &&
          input.status !== "playing" &&
          input.status !== "completed")
      ) {
        return respond(Response.json({ message: "Invalid game details" }, { status: 400 }));
      }

      const status = input.status ?? "planned";
      const name = input.name.trim();

      // Opprett biblioteket første gang brukeren legger til et spill.
      await env.Backlog_Binding
        .prepare(
          "INSERT INTO library (user_id) VALUES (?) ON CONFLICT(user_id) DO NOTHING",
        )
        .bind(session.user.id)
        .run();

      // Bruk IGDB-ID som spill-ID; et spill kan deles av flere brukeres bibliotek.
      await env.Backlog_Binding
        .prepare(
          `INSERT INTO game (id, name, coverImage) VALUES (?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             coverImage = COALESCE(excluded.coverImage, game.coverImage)`,
        )
        .bind(input.igdbGameId, name, input.coverImageId ?? null)
        .run();

      // Koblingen lagrer statusen inne i akkurat denne brukerens bibliotek.
      await env.Backlog_Binding
        .prepare(`
          INSERT INTO library_game (library_id, game_id, status)
          SELECT id, ?, ? FROM library WHERE user_id = ?
          ON CONFLICT(library_id, game_id) DO NOTHING
        `)
        .bind(input.igdbGameId, status, session.user.id)
        .run();

      const entry = await env.Backlog_Binding
        .prepare(`
          SELECT
            game.id AS igdbGameId,
            library_game.status AS status,
            library_game.addedAt AS addedAt,
            game.name AS gameName,
            game.coverImage AS coverImageId
          FROM library
          JOIN library_game ON library_game.library_id = library.id
          JOIN game ON game.id = library_game.game_id
          WHERE library.user_id = ? AND game.id = ?
        `)
        .bind(session.user.id, input.igdbGameId)
        .first<LibraryRow>();

      if (!entry) {
        return respond(Response.json(
          { message: "Could not add game to library" },
          { status: 500 },
        ));
      }

      return respond(Response.json(
        {
          igdbGameId: entry.igdbGameId,
          status: entry.status,
          addedAt: entry.addedAt,
          game: {
            id: entry.igdbGameId,
            name: entry.gameName,
            ...(entry.coverImageId ? { coverImageId: entry.coverImageId } : {}),
          },
        },
        { status: 201 },
      ));
    }

    const deleteMatch = url.pathname.match(/^\/api\/library\/(\d+)$/);

    // Oppdater statusen for spillet bare i biblioteket til innlogget bruker.
    if (deleteMatch && request.method === "PATCH") {
      const igdbGameId = Number(deleteMatch[1]);
      if (!Number.isSafeInteger(igdbGameId) || igdbGameId <= 0) {
        return respond(Response.json({ message: "Invalid game ID" }, { status: 400 }));
      }

      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return respond(Response.json({ message: "Invalid JSON body" }, { status: 400 }));
      }

      if (
        typeof body !== "object" ||
        body === null ||
        Array.isArray(body)
      ) {
        return respond(Response.json({ message: "Invalid status" }, { status: 400 }));
      }

      const status = (body as Record<string, unknown>).status;
      if (status !== "planned" && status !== "playing" && status !== "completed") {
        return respond(Response.json({ message: "Invalid status" }, { status: 400 }));
      }

      const result = await env.Backlog_Binding
        .prepare(`
          UPDATE library_game
          SET status = ?
          WHERE game_id = ?
            AND library_id = (
              SELECT id FROM library WHERE user_id = ?
            )
        `)
        .bind(status, igdbGameId, session.user.id)
        .run();

      if (result.meta.changes === 0) {
        return respond(Response.json(
          { message: "Game not found in your library" },
          { status: 404 },
        ));
      }

      const entry = await env.Backlog_Binding
        .prepare(`
          SELECT
            library_game.status AS status,
            library_game.addedAt AS addedAt,
            game.name AS gameName,
            game.coverImage AS coverImageId
          FROM library
          JOIN library_game ON library_game.library_id = library.id
          JOIN game ON game.id = library_game.game_id
          WHERE library.user_id = ? AND game.id = ?
        `)
        .bind(session.user.id, igdbGameId)
        .first<LibraryRow>();

      if (!entry) {
        return respond(Response.json(
          { message: "Could not load updated library entry" },
          { status: 500 },
        ));
      }

      return respond(Response.json({
        igdbGameId,
        status: entry.status,
        addedAt: entry.addedAt,
        game: {
          id: igdbGameId,
          name: entry.gameName,
          ...(entry.coverImageId ? { coverImageId: entry.coverImageId } : {}),
        },
      }));
    }

    // Slett bare koblingen i brukerens bibliotek, ikke selve spilloppføringen.
    if (deleteMatch && request.method === "DELETE") {
      const igdbGameId = Number(deleteMatch[1]);

      if (!Number.isSafeInteger(igdbGameId) || igdbGameId <= 0) {
        return respond(Response.json({ message: "Invalid game ID" }, { status: 400 }));
      }

      // Bruk både spill-ID og innlogget bruker, slik at andre biblioteker ikke påvirkes.
      const result = await env.Backlog_Binding
        .prepare(`
          DELETE FROM library_game
          WHERE game_id = ?
            AND library_id = (
              SELECT id FROM library WHERE user_id = ?
            )
        `)
        .bind(igdbGameId, session.user.id)
        .run();

      if (result.meta.changes === 0) {
        return respond(Response.json(
          { message: "Game not found in your library" },
          { status: 404 },
        ));
      }

      return respond(new Response(null, { status: 204 }));
    }

    if (url.pathname === "/api/library" && request.method === "GET") {
      // Sørg for at en ny bruker får et tomt bibliotek som kan hentes.
      await env.Backlog_Binding
        .prepare(
          "INSERT INTO library (user_id) VALUES (?) ON CONFLICT(user_id) DO NOTHING",
        )
        .bind(session.user.id)
        .run();

      // Hent bare spillene som er koblet til denne brukerens bibliotek.
      const { results } = await env.Backlog_Binding
        .prepare(`
          SELECT
            game.id AS igdbGameId,
            library_game.status AS status,
            library_game.addedAt AS addedAt,
            game.name AS gameName,
            game.coverImage AS coverImageId
          FROM library
          JOIN library_game ON library_game.library_id = library.id
          JOIN game ON game.id = library_game.game_id
          WHERE library.user_id = ?
        `)
        .bind(session.user.id)
        .all<LibraryRow>();

      return respond(Response.json(
        results.map(({ igdbGameId, status, addedAt, gameName, coverImageId }) => ({
          igdbGameId,
          status,
          addedAt,
          game: {
            id: igdbGameId,
            name: gameName,
            ...(coverImageId ? { coverImageId } : {}),
          },
        })),
      ));
    }

    return respond(Response.json({ message: "Not found" }, { status: 404 }));
  },
};