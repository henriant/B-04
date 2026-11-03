export async function ensureUserLibraryId(
	db: D1Database,
	userId: string,
): Promise<number> {
	await db.batch([
		db
			.prepare(
				`INSERT INTO library ("createdAt")
				 SELECT CURRENT_TIMESTAMP
				 WHERE EXISTS (
				   SELECT 1 FROM "user" WHERE id = ? AND library_id IS NULL
				 )`,
			)
			.bind(userId),
		db
			.prepare(
				`UPDATE "user"
				 SET library_id = last_insert_rowid()
				 WHERE id = ? AND library_id IS NULL`,
			)
			.bind(userId),
	]);

	const user = await db
		.prepare('SELECT library_id AS libraryId FROM "user" WHERE id = ?')
		.bind(userId)
		.first<{ libraryId: number | null }>();
	if (!user) {
		throw new Error("Authenticated user was not found in D1");
	}
	if (user.libraryId === null) {
		throw new Error("Could not assign a library to the user");
	}

	return user.libraryId;
}
