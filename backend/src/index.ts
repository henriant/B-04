import { createAuth } from "./auth.js";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { game, library, libraryGame } from "./db/schema.js";
export * from "./db/schema.js";

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
    const db = drizzle(env.Backlog_Binding);

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
          (typeof input.coverImageId !== "string" 
            || input.coverImageId.trim().length === 0)) ||
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
      await db
        .insert(library)
        .values({ userId: session.user.id })
        .onConflictDoNothing({ target: library.userId });

      // Bruk IGDB-ID som spill-ID; et spill kan deles av flere brukeres bibliotek.
      await db
        .insert(game)
        .values({
          id: input.igdbGameId,
          name,
          coverImage: input.coverImageId ?? null,
        })
        .onConflictDoUpdate({
          target: game.id,
          set: {
            coverImage: sql`coalesce(excluded.coverImage, ${game.coverImage})`,
          },
        });

      // Koblingen lagrer statusen inne i akkurat denne brukerens bibliotek.
      const userLibrary = await db
        .select({ id: library.id })
        .from(library)
        .where(eq(library.userId, session.user.id))
        .get();
      if (!userLibrary) {
        throw new Error("Could not create or load the user's library");
      }

      await db
        .insert(libraryGame)
        .values({
          libraryId: userLibrary.id,
          gameId: input.igdbGameId,
          status,
        })
        .onConflictDoNothing();

      const entry = await db
        .select({
          igdbGameId: game.id,
          status: libraryGame.status,
          addedAt: libraryGame.addedAt,
          gameName: game.name,
          coverImageId: game.coverImage,
        })
        .from(library)
        .innerJoin(libraryGame, eq(libraryGame.libraryId, library.id))
        .innerJoin(game, eq(game.id, libraryGame.gameId))
        .where(and(
          eq(library.userId, session.user.id),
          eq(game.id, input.igdbGameId),
        ))
        .get();

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

      const result = await db
        .update(libraryGame)
        .set({ status })
        .where(and(
          eq(libraryGame.gameId, igdbGameId),
          eq(
            libraryGame.libraryId,
            db.select({ id: library.id })
              .from(library)
              .where(eq(library.userId, session.user.id)),
          ),
        ))
        .run();

      if (result.meta.changes === 0) {
        return respond(Response.json(
          { message: "Game not found in your library" },
          { status: 404 },
        ));
      }

      const entry = await db
        .select({
          igdbGameId: game.id,
          status: libraryGame.status,
          addedAt: libraryGame.addedAt,
          gameName: game.name,
          coverImageId: game.coverImage,
        })
        .from(library)
        .innerJoin(libraryGame, eq(libraryGame.libraryId, library.id))
        .innerJoin(game, eq(game.id, libraryGame.gameId))
        .where(and(
          eq(library.userId, session.user.id),
          eq(game.id, igdbGameId),
        ))
        .get();

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
      const result = await db
        .delete(libraryGame)
        .where(and(
          eq(libraryGame.gameId, igdbGameId),
          eq(
            libraryGame.libraryId,
            db.select({ id: library.id })
              .from(library)
              .where(eq(library.userId, session.user.id)),
          ),
        ))
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
      await db
        .insert(library)
        .values({ userId: session.user.id })
        .onConflictDoNothing({ target: library.userId });

      // Hent bare spillene som er koblet til denne brukerens bibliotek.
      const results = await db
        .select({
          igdbGameId: game.id,
          status: libraryGame.status,
          addedAt: libraryGame.addedAt,
          gameName: game.name,
          coverImageId: game.coverImage,
        })
        .from(library)
        .innerJoin(libraryGame, eq(libraryGame.libraryId, library.id))
        .innerJoin(game, eq(game.id, libraryGame.gameId))
        .where(eq(library.userId, session.user.id));

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