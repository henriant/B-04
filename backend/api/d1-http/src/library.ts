

export async function ensureUserLibraryId(
	db: D1Database,
	userId: string,
): Promise<number> {
	// Each account has one library, so reuse it instead of creating duplicates.
	await db
		.prepare(	
		// TODO CHANGE THIS INTO DRIZZLE SCHEMA CALL
		"INSERT INTO library (user_id) VALUES (?) ON CONFLICT(user_id) DO NOTHING",
		).bind(userId).run();
	const library = await db
		.prepare(
          // TODO CHANGE THIS INTO DRIZZLE SCHEMA CALL
			"SELECT id FROM library WHERE user_id = ?")
		.bind(userId)
		.first<{ id: number }>();
	if (!library) {
		throw new Error("Could not create or load the user's library");
	}
	return library.id;
}
