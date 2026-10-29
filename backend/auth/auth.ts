import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import Backlog_Binding from "../drizzle/src/index.js";

export const auth = betterAuth({
    database: drizzleAdapter(Backlog_Binding, {
        provider: "sqlite"
    }),
    emailAndPassword: { 
        enabled: true, 
    }, 
});