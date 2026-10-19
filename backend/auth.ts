import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import Backlog_Binding from "./database/src/index.js"; // your drizzle instance

export const auth = betterAuth({
    database: drizzleAdapter(Backlog_Binding, {
        provider: "pg", // or "mysql", "sqlite"
    }),
});