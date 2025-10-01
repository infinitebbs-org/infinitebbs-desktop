import { onMount, Show } from "solid-js"
import "./App.css"
import Login from "./pages/login/Login"
import Home from "./pages/home/Home"
import { isLoggedIn, currentUser, checkAuthStatus, logout } from "./utils/auth"
import { Toaster } from "solid-toast"
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow"

function App() {
  let main = getCurrentWebviewWindow()

  onMount(() => {
    main.show()
    checkAuthStatus()
  })

  return (
    <main class="container">
      <Show when={isLoggedIn()} fallback={<Login />}>
        <Home username={currentUser()} onLogout={logout} />
      </Show>
      <Toaster />
    </main>
  )
}

export default App
