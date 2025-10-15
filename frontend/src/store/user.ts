import { createStore } from "solid-js/store"

import { getUserInfo, type UserInfo } from "@/api/user"

// 用户状态接口
interface UserState {
    user: UserInfo | null
    isLoading: boolean
    error: string | null
}

// 创建用户状态存储
const [userState, setUserState] = createStore<UserState>({
    user: null,
    isLoading: false,
    error: null,
})

// 导出状态
export { userState }

// 获取用户信息方法
export const fetchUserInfo = async () => {
    setUserState({ isLoading: true, error: null })
    try {
        const response = await getUserInfo()
        if (response.success) {
            setUserState({ user: response.data })
        } else {
            setUserState({ error: "获取用户信息失败" })
        }
    } catch (error) {
        setUserState({ error: error instanceof Error ? error.message : "未知错误" })
    } finally {
        setUserState({ isLoading: false })
    }
}

// 清空用户信息
export const clearUserInfo = () => {
    setUserState({ user: null })
}
