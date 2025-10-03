import { onMount, Show } from "solid-js"
import Login from "@/pages/login/Login"
import { isLoggedIn, checkAuthStatus } from "@/store/auth"
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow"
import "./App.css"
import { RouterProps } from "@solidjs/router"
import Layout from "./components/layout/Layout"

const App = (props: RouterProps) => {
    let main = getCurrentWebviewWindow()

    onMount(() => {
        main.show()
        checkAuthStatus()
    })

    return (
        <main class="container">
            <Show when={isLoggedIn()} fallback={<Login />}>
                <Layout {...props} />
            </Show>
        </main>
    )
}

export default App
