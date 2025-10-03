import { createSignal, Show } from "solid-js"
import toast from "solid-toast"
import { loginApi, registerApi } from "@/api/auth"
import { login } from "@/store/auth"

import "./Login.css"

type AuthMode = "login" | "register"

const Login = () => {
    const [authMode, setAuthMode] = createSignal<AuthMode>("login")
    const [username, setUsername] = createSignal("")
    const [password, setPassword] = createSignal("")
    const [confirmPassword, setConfirmPassword] = createSignal("")
    const [isLoading, setIsLoading] = createSignal(false)

    const handleLogin = async (): Promise<void> => {
        // 验证输入
        if (!username() || !password()) {
            toast.error("请输入用户名和密码")
            return
        }

        setIsLoading(true)
        try {
            // 使用 API 模块调用远程接口
            const result = await loginApi({
                username: username(),
                password: password(),
            })

            if (result.success && result.data) {
                // 登录成功，保存登录状态
                login(result.data.access_token)
                toast.success(`登录成功！`)
            } else {
                toast.error(result.message || "登录失败")
            }
        } catch (error: any) {
            toast.error(`登录失败: ${error.message || error}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async (): Promise<void> => {
        // 验证输入
        if (!username() || !password() || !confirmPassword()) {
            toast.error("请填写完整注册信息")
            return
        }

        if (password() !== confirmPassword()) {
            toast.error("两次输入的密码不一致")
            return
        }

        setIsLoading(true)
        try {
            // 使用 API 模块调用远程接口
            const result = await registerApi({
                username: username(),
                password: password(),
            })

            if (result.success && result.data) {
                toast.success(`注册成功!`)
            } else {
                toast.error(result.message || "注册失败")
            }
        } catch (error: any) {
            toast.error(`注册失败: ${error.message || error}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = (e: Event): void => {
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
                    onClick={() => setAuthMode("login")}
                    disabled={isLoading()}
                >
                    登录
                </button>
                <button
                    type="button"
                    class={authMode() === "register" ? "active" : ""}
                    onClick={() => setAuthMode("register")}
                    disabled={isLoading()}
                >
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
                    disabled={isLoading()}
                    autocomplete="off"
                />
                <input
                    id="password-input"
                    type="password"
                    value={password()}
                    onInput={(e) => setPassword(e.currentTarget.value)}
                    placeholder="密码"
                    disabled={isLoading()}
                />
                <Show when={authMode() === "register"}>
                    <input
                        id="confirm-password-input"
                        type="password"
                        value={confirmPassword()}
                        onInput={(e) =>
                            setConfirmPassword(e.currentTarget.value)
                        }
                        placeholder="确认密码"
                        disabled={isLoading()}
                    />
                </Show>
                <button type="submit" disabled={isLoading()}>
                    {isLoading()
                        ? "处理中..."
                        : authMode() === "login"
                        ? "登录"
                        : "注册"}
                </button>
            </form>
        </div>
    )
}

export default Login
