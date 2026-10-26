import { defineRelations, sql } from 'drizzle-orm';
import * as t from "drizzle-orm/sqlite-core";

export const user = t.sqliteTable("user", {
  // One user
  id: t.integer().primaryKey({ autoIncrement: true }),
  name: t.text().notNull(),
  email: t.text().notNull(),
  libraryId: t.integer('library_id').references(() => library.id),
  createdAt: t.text('createdAt')
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const library = t.sqliteTable("library", {
  // One library for one user
  id: t.integer().primaryKey({ autoIncrement: true }),
  createdAt: t.text('createdAt')
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const games = t.sqliteTable("games", {
  // Universal details for a single game
  id: t.integer().primaryKey({ autoIncrement: true }),
  name: t.text().notNull(),
});

export const libraryGame = t.sqliteTable("library_game", {
  // Specific details for one game in one library
  libraryId: t.integer('library_id').notNull().references(() => library.id, { onDelete: 'cascade' }),
  gameId: t.integer('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  status: t.text("status", { enum: ["planned", "playing", "finished"] })
      .notNull()
      .default("planned"),
  addedAt: t.text('addedAt')
    .notNull()
    .default(sql`(current_timestamp)`),
  playtime: t.integer().notNull().default(0)
  }, (table) => [
    t.check(
      "status_check",
      sql`${table.status} IN ('planned', 'playing', 'finished')`
    ),
    t.primaryKey({ columns: [table.libraryId, table.gameId] }),
  ]
);

export const relations = defineRelations({ user, library, games, libraryGame }, (r) => ({
  // Defining relations between everything
    user: {
      library: r.one.library({
        from: r.user.libraryId,
        to: r.library.id,
      }),
    },
    library: {
      user: r.one.user({
        from: r.library.id,
        to: r.user.libraryId,
        optional: false,
      }),
      games: r.many.games({
        from: r.library.id.through(r.libraryGame.libraryId),
        to: r.games.id.through(r.libraryGame.gameId),
      }),
    },
    game: {
      libraries: r.many.library({
        from: r.games.id.through(r.libraryGame.gameId),
        to: r.library.id.through(r.libraryGame.libraryId),
      }),
    },
  })
);