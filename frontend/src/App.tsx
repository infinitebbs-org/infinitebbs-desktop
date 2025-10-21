import "./App.css"

import { RouterProps } from "@solidjs/router"
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow"
import { onMount, Show } from "solid-js"

import Login from "@/pages/login/Login"
import { userState } from "@/store/user"

import Editor from "./components/editor/Editor"
import Layout from "./components/layout/Layout"
import { start_tick_timer } from "./utils/time"

const App = (props: RouterProps) => {
    let main = getCurrentWebviewWindow()

    onMount(async () => {
        main.show()
        start_tick_timer()
    })

    return (
        <div class="container">
            <Show when={userState.user} fallback={<Login />}>
                <Layout {...props} />
            </Show>
            <Editor />
        </div>
    )
}

export default App
