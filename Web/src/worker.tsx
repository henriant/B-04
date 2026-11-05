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

export default defineApp([
    render(Document, [
    layout(Layout, [
      route("/", Home),
      route("/Library", Library),
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
