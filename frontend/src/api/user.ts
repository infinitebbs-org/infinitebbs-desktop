import { api, R } from "."

// 当前用户信息类型定义(包含完整信息)
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

// 其他用户信息类型定义(基本信息)
export interface UserProfile {
    id: number
    name: string
    roles: string[]
}

// 获取当前用户信息
export const getUserInfo = async (): Promise<R<UserInfo>> => {
    return api.get("user/info").json()
}

// 获取指定用户信息
// GET /user/:id
export const getUserProfile = async (userId: number): Promise<R<UserProfile>> => {
    return api.get(`user/${userId}`).json()
}
