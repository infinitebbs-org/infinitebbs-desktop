import { onMount, Show } from "solid-js"
import Login from "@/pages/login/Login"
import { userState } from "@/store/user"
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow"
import "./App.css"
import { RouterProps } from "@solidjs/router"
import Layout from "./components/layout/Layout"
import Editor from "./components/editor/Editor"

const App = (props: RouterProps) => {
    let main = getCurrentWebviewWindow()

    onMount(async () => {
        main.show()
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
