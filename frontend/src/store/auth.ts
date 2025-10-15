import toast from "solid-toast"

import { loginApi, logoutApi, registerApi } from "@/api/auth"

import { initTopics } from "./topic"
import { clearUserInfo, fetchUserInfo } from "./user"




export const getAccessToken = (): string | null => {
    return localStorage.getItem("access_token")
}

const setAccessToken = (token: string): void => {
    localStorage.setItem("access_token", token)
}

const removeAccessToken = (): void => {
    localStorage.removeItem("access_token")
}

// 登录方法
export const login = async (username: string, password: string) => {
    try {
        const result = await loginApi({ username, password })

        if (result.success && result.data) {
            setAccessToken(result.data.access_token)
            await fetchUserInfo() // 登录成功后获取用户信息
            initTopics() // 初始化话题数据和定时器
            toast.success("登录成功！")
            return { success: true }
        } else {
            toast.error(result.message || "登录失败")
            return { success: false, message: result.message }
        }
    } catch (error: any) {
        const message = error.message || "登录失败"
        toast.error(message)
        return { success: false, message }
    }
}

// 注册方法
export const register = async (username: string, password: string) => {
    try {
        const result = await registerApi({ username, password })

        if (result.success && result.data) {
            toast.success("注册成功！")
            return { success: true }
        } else {
            toast.error(result.message || "注册失败")
            return { success: false, message: result.message }
        }
    } catch (error: any) {
        const message = error.message || "注册失败"
        toast.error(message)
        return { success: false, message }
    }
}

// 登出方法
export const logout = async () => {
    try {
        const response = await logoutApi()
        if (response.success) {
            removeAccessToken()
            clearUserInfo() // 清空用户信息
            toast.success("登出成功")
            return { success: true }
        } else {
            toast.error("登出失败")
            return { success: false }
        }
    } catch (error: any) {
        const message = error.message || "登出失败"
        toast.error(message)
        return { success: false, message }
    }
}
