import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const User = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: integer().notNull(),
  email: text().notNull().unique(),
});
