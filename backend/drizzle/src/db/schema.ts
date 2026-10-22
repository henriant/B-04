import { defineRelations } from 'drizzle-orm';
import * as t from "drizzle-orm/sqlite-core";

export const user = t.sqliteTable("user", {
  id: t.integer().primaryKey({ autoIncrement: true }),
  name: t.text().notNull(),
  email: t.text().notNull(),
  libraryId: t.integer('library_id').references(() => library.id),
});

export const library = t.sqliteTable("library", {
  id: t.integer().primaryKey({ autoIncrement: true }),
});

export const game = t.sqliteTable("game", {
  id: t.integer().primaryKey({ autoIncrement: true }),
});

export const libraryGame = t.sqliteTable("library_game", {
  libraryId: t.integer('library_id').notNull().references(() => library.id),
  gameId: t.integer('game_id').notNull().references(() => game.id),
}, (table) => [
  t.primaryKey({ columns: [table.libraryId, table.gameId] }),
]);

export const relations = defineRelations({ user, library, game, libraryGame }, (r) => ({
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
      games: r.many.game({
        from: r.library.id.through(r.libraryGame.libraryId),
        to: r.game.id.through(r.libraryGame.gameId),
      }),
    },
    game: {
      libraries: r.many.library({
        from: r.game.id.through(r.libraryGame.gameId),
        to: r.library.id.through(r.libraryGame.libraryId),
      }),
    },
  })
);