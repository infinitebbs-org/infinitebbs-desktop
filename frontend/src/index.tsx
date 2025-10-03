/* @refresh reload */
import { render } from "solid-js/web"
import App from "./App"
import { Router } from "@solidjs/router"

import Home from "./pages/home/Home"
import Profile from "./pages/profile/Profile"
import { Toaster } from "solid-toast"

const routes = [
    {
        path: "/",
        component: Home,
    },
    {
        path: "/profile",
        component: Profile,
    },
]

render(
    () => (
        <>
            <Router root={App}>{routes}</Router>
            <Toaster />
        </>
    ),
    document.getElementById("root") as HTMLElement
)
