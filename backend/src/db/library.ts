import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { game, library, libraryGame } from "./schema.js";

export type LibraryStatus = "planned" | "playing" | "completed";

export type LibraryEntryRow = {
	igdbGameId: number;
	status: LibraryStatus;
	addedAt: string;
	gameName: string;
	coverImageId: string | null;
};

export function createLibraryQueries(database: D1Database) {
	const db = drizzle(database);

	return {
		async ensureUserLibraryId(userId: string): Promise<number> {
			await db
				.insert(library)
				.values({ userId })
				.onConflictDoNothing({ target: library.userId });

			const userLibrary = await db
				.select({ id: library.id })
				.from(library)
				.where(eq(library.userId, userId))
				.get();
			if (!userLibrary) {
				throw new Error("Could not create or load the user's library");
			}
			return userLibrary.id;
		},

		async upsertGame(
			id: number,
			name: string,
			coverImage: string | null,
		): Promise<void> {
			await db
				.insert(game)
				.values({ id, name, coverImage })
				.onConflictDoUpdate({
					target: game.id,
					set: {
						name,
						coverImage: sql`coalesce(excluded.coverImage, ${game.coverImage})`,
					},
				});
		},

		async addGameToLibrary(
			libraryId: number,
			gameId: number,
			status: LibraryStatus,
		): Promise<void> {
			await db
				.insert(libraryGame)
				.values({ libraryId, gameId, status })
				.onConflictDoNothing();
		},

		async getLibraryEntry(
			libraryId: number,
			gameId: number,
		): Promise<LibraryEntryRow | null> {
			const entry = await db
				.select({
					igdbGameId: game.id,
					status: libraryGame.status,
					addedAt: libraryGame.addedAt,
					gameName: game.name,
					coverImageId: game.coverImage,
				})
				.from(libraryGame)
				.innerJoin(game, eq(game.id, libraryGame.gameId))
				.where(and(
					eq(libraryGame.libraryId, libraryId),
					eq(libraryGame.gameId, gameId),
				))
				.get();
			return entry ?? null;
		},

		async listLibraryEntries(libraryId: number): Promise<LibraryEntryRow[]> {
			return db
				.select({
					igdbGameId: game.id,
					status: libraryGame.status,
					addedAt: libraryGame.addedAt,
					gameName: game.name,
					coverImageId: game.coverImage,
				})
				.from(libraryGame)
				.innerJoin(game, eq(game.id, libraryGame.gameId))
				.where(eq(libraryGame.libraryId, libraryId))
				.orderBy(game.name);
		},

		async updateLibraryGameStatus(
			libraryId: number,
			gameId: number,
			status: LibraryStatus,
		): Promise<number> {
			const result = await db
				.update(libraryGame)
				.set({ status })
				.where(and(
					eq(libraryGame.libraryId, libraryId),
					eq(libraryGame.gameId, gameId),
				))
				.run();
			return result.meta.changes;
		},

		async deleteLibraryGame(libraryId: number, gameId: number): Promise<number> {
			const result = await db
				.delete(libraryGame)
				.where(and(
					eq(libraryGame.libraryId, libraryId),
					eq(libraryGame.gameId, gameId),
				))
				.run();
			return result.meta.changes;
		},
	};
}
