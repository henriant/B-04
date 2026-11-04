import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { betterAuth } from "better-auth";
import { testUtils } from "better-auth/plugins";
import { describe, expect, it } from "vitest";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { account, session, user, verification } from "../backend/src/db/schema.js";

describe("database user lifecycle", () => {
	it("creates a user, adds and reads a library game, then deletes the user", async () => {
		const client = createClient({ url: "file::memory:" });

		try {
			await client.execute("PRAGMA foreign_keys = ON");

			const schemaStatements = [
				`CREATE TABLE user (
					id TEXT PRIMARY KEY,
					name TEXT NOT NULL,
					email TEXT NOT NULL UNIQUE,
					email_verified INTEGER NOT NULL DEFAULT 0,
					image TEXT,
					created_at INTEGER NOT NULL,
					updated_at INTEGER NOT NULL,
					role TEXT NOT NULL DEFAULT 'user'
				)`,
				`CREATE TABLE session (
					id TEXT PRIMARY KEY,
					expires_at INTEGER NOT NULL,
					token TEXT NOT NULL UNIQUE,
					created_at INTEGER NOT NULL,
					updated_at INTEGER NOT NULL,
					ip_address TEXT,
					user_agent TEXT,
					user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
				)`,
				`CREATE TABLE account (
					id TEXT PRIMARY KEY,
					account_id TEXT NOT NULL,
					provider_id TEXT NOT NULL,
					user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
					access_token TEXT,
					refresh_token TEXT,
					id_token TEXT,
					access_token_expires_at INTEGER,
					refresh_token_expires_at INTEGER,
					scope TEXT,
					password TEXT,
					created_at INTEGER NOT NULL,
					updated_at INTEGER NOT NULL
				)`,
				`CREATE TABLE verification (
					id TEXT PRIMARY KEY,
					identifier TEXT NOT NULL,
					value TEXT NOT NULL,
					expires_at INTEGER NOT NULL,
					created_at INTEGER NOT NULL,
					updated_at INTEGER NOT NULL
				)`,
				`CREATE TABLE library (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					user_id TEXT NOT NULL UNIQUE REFERENCES user(id) ON DELETE CASCADE,
					createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
				)`,
				`CREATE TABLE game (
					id INTEGER PRIMARY KEY,
					name TEXT NOT NULL,
					summary TEXT,
					releaseDate TEXT,
					publisher TEXT,
					developer TEXT,
					genre TEXT,
					coverImage TEXT
				)`,
				`CREATE TABLE library_game (
					library_id INTEGER NOT NULL REFERENCES library(id) ON DELETE CASCADE,
					game_id INTEGER NOT NULL REFERENCES game(id) ON DELETE CASCADE,
					status TEXT NOT NULL DEFAULT 'planned'
						CHECK(status IN ('planned', 'playing', 'completed')),
					addedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
					playtime INTEGER NOT NULL DEFAULT 0,
					PRIMARY KEY (library_id, game_id)
				)`,
			];

			for (const statement of schemaStatements) {
				await client.execute(statement);
			}

			const db = drizzle({ client });
			const auth = betterAuth({
				secret: "database-test-only-secret-not-for-production",
				database: drizzleAdapter(db, {
					provider: "sqlite",
					schema: { user, session, account, verification },
				}),
				plugins: [testUtils()],
			});
			const test = (await auth.$context).test;
			const createdUser = await test.saveUser(
				test.createUser({
					name: "Library Test User",
					email: "library-test@example.com",
				}),
			);

			await client.execute({
				sql: "INSERT INTO library (user_id) VALUES (?)",
				args: [createdUser.id],
			});
			await client.execute({
				sql: "INSERT INTO game (id, name) VALUES (?, ?)",
				args: [42, "Test Game"],
			});

			const userLibrary = await client.execute({
				sql: "SELECT id FROM library WHERE user_id = ?",
				args: [createdUser.id],
			});
			const libraryId = userLibrary.rows[0]?.id;
			if (typeof libraryId !== "number") {
				throw new Error("The new user's library was not created");
			}

			await client.execute({
				sql: "INSERT INTO library_game (library_id, game_id, status) VALUES (?, ?, ?)",
				args: [libraryId, 42, "planned"],
			});

			const userData = await client.execute({
				sql: `SELECT user.id AS userId, user.name, user.email,
					game.id AS gameId, game.name AS gameName, library_game.status
					FROM user
					INNER JOIN library ON library.user_id = user.id
					INNER JOIN library_game ON library_game.library_id = library.id
					INNER JOIN game ON game.id = library_game.game_id
					WHERE user.id = ?`,
				args: [createdUser.id],
			});

			expect(userData.rows).toHaveLength(1);
			expect(userData.rows[0]?.userId).toBe(createdUser.id);
			expect(userData.rows[0]?.name).toBe("Library Test User");
			expect(userData.rows[0]?.email).toBe("library-test@example.com");
			expect(userData.rows[0]?.gameId).toBe(42);
			expect(userData.rows[0]?.gameName).toBe("Test Game");
			expect(userData.rows[0]?.status).toBe("planned");

			await test.deleteUser(createdUser.id);

			const deletedUser = await client.execute({
				sql: "SELECT id FROM user WHERE id = ?",
				args: [createdUser.id],
			});
			const deletedLibrary = await client.execute({
				sql: "SELECT id FROM library WHERE user_id = ?",
				args: [createdUser.id],
			});
			const deletedLibraryGame = await client.execute({
				sql: "SELECT game_id FROM library_game WHERE library_id = ?",
				args: [libraryId],
			});

			expect(deletedUser.rows).toHaveLength(0);
			expect(deletedLibrary.rows).toHaveLength(0);
			expect(deletedLibraryGame.rows).toHaveLength(0);
		} finally {
			client.close();
		}
	});
});
