import { layout, render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import { Layout } from "./components/pageComponents/Layout"

import { Document } from "@/app/document";
import { setCommonHeaders } from "@/app/headers";
import { Home } from "@/app/pages/Home";
import { Library } from "./app/pages/Library";
import { LogIn } from "./app/pages/LogIn";
import { SignUp } from "./app/pages/SignUp"
import { GameInfo } from "./app/pages/GameInfo";
import { SearchResults } from "./app/pages/SearchResults";
import { Profile } from "./app/pages/Profile";

export type AppContext = {};

async function requireLibrarySession(request: Request): Promise<Response | null> {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!apiBaseUrl) {
    console.error("VITE_API_BASE_URL is not configured");
    return new Response("Authentication service is not configured", {
      status: 500,
    });
  }

  const cookie = request.headers.get("Cookie");
  if (!cookie) {
    return Response.redirect(new URL("/LogIn", request.url), 302);
  }

  let response: Response;
  try {
    response = await fetch(new URL("/api/auth/get-session", apiBaseUrl), {
      headers: { Cookie: cookie },
    });
  } catch (cause: unknown) {
    console.error("Could not verify the library route session:", cause);
    return new Response("Authentication service is unavailable", {
      status: 502,
    });
  }

  if (!response.ok) {
    console.error("Session verification failed:", response.status);
    return new Response("Could not verify your session", { status: 502 });
  }

  let sessionData: unknown;
  try {
    sessionData = await response.json();
  } catch (cause: unknown) {
    console.error("Session verification returned invalid JSON:", cause);
    return new Response("Could not verify your session", { status: 502 });
  }

  if (isAuthenticatedSession(sessionData)) {
    return null;
  }

  return Response.redirect(new URL("/LogIn", request.url), 302);
}

function isAuthenticatedSession(
  value: unknown,
): value is { session: object; user: object } {
  return (
    typeof value === "object" &&
    value !== null &&
    "session" in value &&
    typeof value.session === "object" &&
    value.session !== null &&
    "user" in value &&
    typeof value.user === "object" &&
    value.user !== null
  );
}

export default defineApp([
    render(Document, [
    layout(Layout, [
      route("/", Home),
      route("/Library", async ({ request }) => {
        const unauthenticatedResponse = await requireLibrarySession(request);
        return unauthenticatedResponse ?? <Library />;
      }),
      route("/Profile", Profile),
      route("/LogIn", LogIn),
      route("/SignUp", SignUp),
      route("/GameInfo", ({ request }) => {
        const url = new URL(request.url);
        const gameId = url.searchParams.get("id") ?? "";
        return <GameInfo gameId={gameId} />;
      }),

      /* Test for SearchResults pages*/
      route("/SearchResults", ({ request }) => {
        const url = new URL(request.url);
        const query = url.searchParams.get("q") ?? "";

        return <SearchResults query={query} />;
      }),
      
    ])
  ])
])
