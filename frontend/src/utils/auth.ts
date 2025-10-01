import { createSignal } from "solid-js"

// 创建全局的认证状态
export const [isLoggedIn, setIsLoggedIn] = createSignal(false)
export const [currentUser, setCurrentUser] = createSignal("")

// 检查登录状态（可以从 localStorage 或调用后端 API）
export function checkAuthStatus(): boolean {
    try {
        const token = localStorage.getItem("auth_token")
        const username = localStorage.getItem("username")

        if (token && username) {
            setIsLoggedIn(true)
            setCurrentUser(username)
            return true
        }
    } catch (error) {
        console.error("检查登录状态失败:", error)
    }

    setIsLoggedIn(false)
    setCurrentUser("")
    return false
}

// 登录成功后调用
export function login(username: string, token?: string) {
    localStorage.setItem("username", username)
    if (token) {
        localStorage.setItem("auth_token", token)
    }
    setIsLoggedIn(true)
    setCurrentUser(username)
}

// 退出登录
export function logout() {
    localStorage.removeItem("username")
    localStorage.removeItem("auth_token")
    setIsLoggedIn(false)
    setCurrentUser("")
}
