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

export type AppContext = {};

export default defineApp([
    render(Document, [
    layout(Layout, [
      route("/", Home),
      route("/Library", Library),
      route("/LogIn", LogIn),
      route("/SignUp", SignUp),

      /* Test for GameInfo og SearchResults pages*/
      route("/GameInfo", GameInfo),
      route("/SearchResults", SearchResults)
      
      
    ])
  ])
])