import * as t from "drizzle-orm/sqlite-core";

export const usersTable = t.sqliteTable("user", {
  id: t.integer().primaryKey({ autoIncrement: true }),
  name: t.text().notNull(),
  email: t.text().notNull(),
  library: t.int().references(() => libraryTable.id),
})

export const libraryTable = t.sqliteTable("library", {
  id: t.integer().primaryKey({ autoIncrement: true }),
  game: t.int().references(() => gameTable.id),
})

export const gameTable = t.sqliteTable("game", {
  id: t.integer().primaryKey({ autoIncrement: true }),
})
