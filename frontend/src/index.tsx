/* @refresh reload */
import { Router } from "@solidjs/router"
import { render } from "solid-js/web"
import { Toaster } from "solid-toast"

import App from "./App"
import Home from "./pages/home/Home"
import Profile from "./pages/profile/Profile"
import Settings from "./pages/settings/Settings"
import Topic from "./pages/topic/Topic"

const routes = [
    {
        path: "/",
        component: Home,
    },
    {
        path: "/profile",
        component: Profile,
    },
    {
        path: "/settings",
        component: Settings,
    },
    {
        path: "/topic/:id",
        component: Topic,
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
