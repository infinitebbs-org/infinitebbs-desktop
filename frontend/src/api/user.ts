import { api, R } from "."

// 用户信息类型定义
export interface UserInfo {
    id: number
    info: {
        name: string
        coin: number
        bean: number
        premium: {
            is_active: boolean
            expires_at: string | null
        }
    }
    roles: string[]
}

// 获取用户信息
export const getUserInfo = async (): Promise<R<UserInfo>> => {
    return api.get("user/info").json()
}
