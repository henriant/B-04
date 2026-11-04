import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import {
	account,
	session,
	user,
	verification,
} from "../../../src/db/schema.js";
import { ensureUserLibraryId } from "./library.js";
import type { Bindings } from "./index.js";

const authSchema = { user, session, account, verification };

export function createAuth(env: Bindings, requestUrl: string) {
	if (!env.BETTER_AUTH_SECRET) {
		throw new Error("BETTER_AUTH_SECRET is not configured");
	}

	const db = drizzle(env.DB);

	return betterAuth({
		baseURL: env.BETTER_AUTH_URL || new URL(requestUrl).origin,
		secret: env.BETTER_AUTH_SECRET,
		trustedOrigins: [
			"http://localhost:5174",
			"http://localhost:8081",
		],
		database: drizzleAdapter(db, {
			provider: "sqlite",
			schema: authSchema,
		}),
		databaseHooks: {
			user: {
				create: {
					after: async (createdUser) => {
						await ensureUserLibraryId(env.DB, createdUser.id);
					},
				},
			},
		},
		emailAndPassword: {
			enabled: true,
		},
		user: {
			deleteUser: {
				enabled: true,
			},
		},
	});
}
