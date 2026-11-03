import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src/index";

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("d1-http worker", () => {
	it("returns an API health response (unit style)", async () => {
		const request = new IncomingRequest("http://example.com");
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toBe("d1-http API");
	});

	it("requires a search query before calling IGDB", async () => {
		const request = new IncomingRequest("http://example.com/api/games");
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(400);
		expect(await response.json()).toEqual({
			error: "Search query is required",
		});
	});

	it("rejects search queries over 80 characters", async () => {
		const query = encodeURIComponent("a".repeat(81));
		const request = new IncomingRequest(
			`http://example.com/api/games?search=${query}`,
		);
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(400);
		expect(await response.json()).toEqual({
			error: "Search query must be 80 characters or fewer",
		});
	});

	it("returns an API health response (integration style)", async () => {
		const response = await SELF.fetch("https://example.com");
		expect(await response.text()).toBe("d1-http API");
	});
});
