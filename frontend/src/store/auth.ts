import { createSignal } from "solid-js"

// 创建全局的认证状态
export const [isLoggedIn, setIsLoggedIn] = createSignal(false)

// 检查登录状态
export const checkAuthStatus = (): boolean => {
    try {
        const token = localStorage.getItem("access_token")

        if (token) {
            setIsLoggedIn(true)
            return true
        }
    } catch (error) {
        console.error("检查登录状态失败:", error)
    }

    setIsLoggedIn(false)
    return false
}

export const getAccessToken = (): string | null => {
    return localStorage.getItem("access_token")
}

export const removeAccessToken = (): void => {
    localStorage.removeItem("access_token")
}

// 登录成功后调用
export const login = (token: string): void => {
    localStorage.setItem("access_token", token)
    setIsLoggedIn(true)
}

// 退出登录
export const logout = (): void => {
    localStorage.removeItem("access_token")
    setIsLoggedIn(false)
}
