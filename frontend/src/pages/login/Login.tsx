import { invoke } from "@tauri-apps/api/core"
import { createSignal, Show } from "solid-js"
import toast from "solid-toast"
import { login } from "../../utils/auth"

import "./Login.css"

type AuthMode = "login" | "register"

function Login() {
  const [authMode, setAuthMode] = createSignal<AuthMode>("login")
  const [username, setUsername] = createSignal("")
  const [password, setPassword] = createSignal("")
  const [confirmPassword, setConfirmPassword] = createSignal("")
  const [inviteCode, setInviteCode] = createSignal("")

  async function handleLogin() {
    // 验证输入
    if (!username() || !password()) {
      toast.error("请输入用户名和密码")
      return
    }

    try {
      // 这里调用后端登录接口（需要在 Rust 后端实现 login 命令）
      const result: any = await invoke("login", {
        username: username(),
        password: password(),
      })

      // 登录成功，保存登录状态
      login(username(), result?.token)
      toast.success(`登录成功！欢迎 ${username()}`)
    } catch (error) {
      toast.error(`登录失败: ${error}`)
    }
  }

  async function handleRegister() {
    // 验证输入
    if (!username() || !password() || !confirmPassword() || !inviteCode()) {
      toast.error("请填写完整注册信息")
      return
    }

    if (password() !== confirmPassword()) {
      toast.error("两次输入的密码不一致")
      return
    }

    try {
      // 这里调用后端注册接口（需要在 Rust 后端实现 register 命令）
      const result: any = await invoke("register", {
        username: username(),
        password: password(),
        inviteCode: inviteCode(),
      })

      // 注册成功，自动登录
      login(username(), result?.token)
      toast.success(`注册成功！欢迎 ${username()}`)
    } catch (error) {
      toast.error(`注册失败: ${error}`)
    }
  }

  function handleSubmit(e: Event) {
    e.preventDefault()
    if (authMode() === "login") {
      handleLogin()
    } else {
      handleRegister()
    }
  }

  return (
    <div class="auth-page">
      {/* 顶部选择器 */}
      <div class="auth-mode-selector">
        <button
          type="button"
          class={authMode() === "login" ? "active" : ""}
          onClick={() => setAuthMode("login")}>
          登录
        </button>
        <button
          type="button"
          class={authMode() === "register" ? "active" : ""}
          onClick={() => setAuthMode("register")}>
          注册
        </button>
      </div>

      <form class="login-container" onSubmit={handleSubmit}>
        <input
          id="username-input"
          type="text"
          value={username()}
          onInput={(e) => setUsername(e.currentTarget.value)}
          placeholder="用户名"
        />
        <input
          id="password-input"
          type="password"
          value={password()}
          onInput={(e) => setPassword(e.currentTarget.value)}
          placeholder="密码"
        />
        <Show when={authMode() === "register"}>
          <input
            id="confirm-password-input"
            type="password"
            value={confirmPassword()}
            onInput={(e) => setConfirmPassword(e.currentTarget.value)}
            placeholder="确认密码"
          />
          <input
            id="invite-code-input"
            type="text"
            value={inviteCode()}
            onInput={(e) => setInviteCode(e.currentTarget.value)}
            placeholder="兑换码"
          />
        </Show>
        <button type="submit">
          {authMode() === "login" ? "登录" : "注册"}
        </button>
      </form>
    </div>
  )
}

export default Login
