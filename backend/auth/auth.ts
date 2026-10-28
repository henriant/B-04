import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
// import Backlog_Binding from "../drizzle/src/index.js"; // your drizzle instance
import { createDb } from "../drizzle/src/index.js";
import * as schema from "../drizzle/src/db/schema.js";

export interface Env {
  Backlog_Binding: D1Database;
}

export const auth = (env: Env) =>
  betterAuth({
    database: drizzleAdapter(createDb(env.Backlog_Binding), {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: { enabled: true },
  }
);

/*
export const auth = betterAuth({
    database: drizzleAdapter(Backlog_Binding, {
        provider: "sqlite"
    }),
    emailAndPassword: { 
        enabled: true, 
    }, 
});
*/