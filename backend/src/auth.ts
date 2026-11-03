
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import { account, session, user, verification } from "./db/schema.js";

export function createAuth(database: D1Database) {
  const db = drizzle(database);

  return betterAuth({
    // Bare webappens lokale origin får sende innloggingsforespørsler.
    trustedOrigins: ["http://localhost:5174"],
    database: drizzleAdapter(db, {
      provider: "sqlite",
      // Better Auth lagrer brukere, økter og kontoer i disse tabellene.
      schema: { user, session, account, verification },
    }),
    emailAndPassword: {
      enabled: true,
    },
  });
}
