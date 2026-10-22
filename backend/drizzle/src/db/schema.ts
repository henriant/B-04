import { defineRelations } from 'drizzle-orm';
import * as t from "drizzle-orm/sqlite-core";

export const user = t.sqliteTable("user", {
  id: t.integer().primaryKey({ autoIncrement: true }),
  name: t.text().notNull(),
  email: t.text().notNull(),
  library: t.integer('library_id'),
})

export const library = t.sqliteTable("library", {
  id: t.integer().primaryKey({ autoIncrement: true }),
  ownerId: t.int('owner_id'),
})

export const game = t.sqliteTable("game", {
  id: t.integer().primaryKey({ autoIncrement: true }),
})
