import { createLibraryQueries } from "../../../src/db/library.js";

export async function ensureUserLibraryId(db: D1Database, userId: string): Promise<number> {
	return createLibraryQueries(db).ensureUserLibraryId(userId);
}
