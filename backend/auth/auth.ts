import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
// import Backlog_Binding from "../drizzle/src/index.js";
import { createDb } from "../drizzle/src/index.js";
import * as schema from "../drizzle/src/db/schema.js";
import * as dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({
  path: path.resolve(__dirname, '../.env') 
})

export type AuthEnv = {
  DB: D1Database;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
};

export const createAuth = (env: AuthEnv) => betterAuth({
  database: drizzleAdapter(createDb(env.DB), {
    provider: "sqlite", // D1 is SQLite
    schema,
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: { enabled: true },
  trustedOrigins: [
    "http://localhost:3000", // Web dev
    // add your mobile scheme / production origins
  ],
});

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