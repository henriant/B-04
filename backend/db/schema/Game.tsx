import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Game = sqliteTable("game", {
    id: integer().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    releaseDate: integer().notNull(),
});
