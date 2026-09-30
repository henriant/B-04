import { layout, render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import { Layout } from "./components/Layout"

import { Document } from "@/app/document";
import { setCommonHeaders } from "@/app/headers";
import { Home } from "@/app/pages/Home";
import { Library } from "./app/pages/Library";
import { LogIn } from "./app/pages/LogIn";
import { SignUp } from "./app/pages/SignUp"

export type AppContext = {};

export default defineApp([
    render(Document, [
    layout(Layout, [
      route("/", Home),
      route("/Library", Library),
      route("/LogIn", LogIn),
      route("/SignUp", SignUp)
    ])
  ])
])