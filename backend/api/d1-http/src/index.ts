/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

type Bindings = {
	DB: D1Database;
	API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();



app.use("*", prettyJSON(), logger(), async (c, next) => {
	const auth = bearerAuth({ token: c.env.API_KEY as string}) as any;
	return auth(c, next);
});

app.post("/api/all", async (c) => {
	try {
		let { query, params } = await c.req.json();
		let stmt = c.env.DB.prepare(query);
		if (params) {
			stmt = stmt.bind(params);
		}

		const result = await stmt.run();
		return c.json(result);
	} catch (err) {
		return c.json({ error: `Failed to run query: ${err}` }, 500);
	}
});

app.post("/api/exec", async (c) => {
		try {
		let { query } = await c.req.json();
		let result = await c.env.DB.exec(query);
		return c.json(result);
	} catch (err) {
		return c.json({ error: `Failed to run query: ${err}` }, 500);
	}
});

app.post("/api/batch", async (c) => {
	try {
		let { batch } = await c.req.json();
		let stmts = [];
		for (let query of batch) {
			let stmt = c.env.DB.prepare(query.query);
			if (query.params) {
				stmts.push(stmt.bind(query.params));
			} else {
				stmts.push(stmt);
			}
		}
		const results = await c.env.DB.batch(stmts);
		return c.json(results);
	} catch (err) {
		return c.json({ error: `Failed to run query: ${err}` }, 500);
	}
});



export default app;
