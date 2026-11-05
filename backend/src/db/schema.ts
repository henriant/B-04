import { defineRelations, sql } from 'drizzle-orm';
import * as t from "drizzle-orm/sqlite-core";

export const user = t.sqliteTable("user", {
  // One user
  // Better Auth uses text IDs
  id: t.text("id").primaryKey(),
  name: t.text("name").notNull().unique(),
  email: t.text("email").notNull().unique(),
  emailVerified: t.integer("email_verified", { mode: "boolean" }).default(false).notNull(),
  image: t.text("image"),
  createdAt: t.integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()).$onUpdate(() => new Date()).notNull(),
  userRole: t.text("role", { enum: ["user", "admin", "developer"] }).notNull().default("user"),
});

export const session = t.sqliteTable("session", {
    id: t.text("id").primaryKey(),
    expiresAt: t.integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: t.text("token").notNull().unique(),
    createdAt: t.integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()).notNull(),
    updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()).$onUpdate(() => new Date()).notNull(),
    ipAddress: t.text("ip_address"),
    userAgent: t.text("user_agent"),
    userId: t.text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [t.index("session_userId_idx").on(table.userId)],
);

export const account = t.sqliteTable("account", {
    id: t.text("id").primaryKey(),
    accountId: t.text("account_id").notNull(),
    providerId: t.text("provider_id").notNull(),
    userId: t.text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: t.text("access_token"),
    refreshToken: t.text("refresh_token"),
    idToken: t.text("id_token"),
    accessTokenExpiresAt: t.integer("access_token_expires_at", {mode: "timestamp_ms",}),
    refreshTokenExpiresAt: t.integer("refresh_token_expires_at", {mode: "timestamp_ms",}),
    scope: t.text("scope"),
    password: t.text("password"),
    createdAt: t.integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()).notNull(),
    updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()).$onUpdate(() => new Date()).notNull(),
  },
  (table) => [t.index("account_userId_idx").on(table.userId)],
);

export const verification = t.sqliteTable("verification", {
    id: t.text("id").primaryKey(),
    identifier: t.text("identifier").notNull(),
    value: t.text("value").notNull(),
    expiresAt: t.integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: t.integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()).notNull(),
    updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()).$onUpdate(() => new Date()).notNull(),
  },
  (table) => [t.index("verification_identifier_idx").on(table.identifier)],
);

export const library = t.sqliteTable("library", {
  // One library for one user
  id: t.integer().primaryKey({ autoIncrement: true }),
  userId: t.text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  createdAt: t.text('createdAt').notNull().default(sql`(current_timestamp)`),
});

export const game = t.sqliteTable("game", {
  // We use the IGDB's ID for our ID instead of our own
  id: t.integer().primaryKey(),
  name: t.text().notNull(),
  summary: t.text(),
  releaseDate: t.text(),
  publisher: t.text(),
  developer: t.text(),
  genre: t.text(),
  coverImage: t.text(),
});

export const libraryGame = t.sqliteTable("library_game", {
  // This is the real library of the user, where the data for one game in one library is stored
  libraryId: t.integer('library_id').notNull().references(() => library.id, { onDelete: 'cascade' }),
  gameId: t.integer('game_id').notNull().references(() => game.id, { onDelete: 'cascade' }),
  status: t.text("status", { enum: ["planned", "playing", "completed"] }).notNull().default("planned"),
  addedAt: t.text('addedAt').notNull().default(sql`(current_timestamp)`),
  playtime: t.integer().notNull().default(0)
  }, (table) => [
    t.check(
      "status_check",
      sql`${table.status} IN ('planned', 'playing', 'completed')`
    ),
    t.primaryKey({ columns: [table.libraryId, table.gameId] }),
  ]
);

export const relations = defineRelations({ user, library, game, libraryGame }, (r) => ({
    user: {
      library: r.one.library({
        from: r.user.id,
        to: r.library.userId,
      }),
    },
    library: {
      user: r.one.user({
        from: r.library.userId,
        to: r.user.id,
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

export const userRelations = defineRelations({ user, session, account }, ( r ) => ({
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),
  },
  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }), 
  },
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }), 
  }
}));
