import { api, R } from "."


// 认证相关的类型定义
export interface UserBaseRequest {
    username: string
    password: string
}

export interface AuthResponse {
    access_token: string
}


// 登录接口
export const loginApi = async (
    credentials: UserBaseRequest
): Promise<R<AuthResponse>> => {
    return api.post("auth/login", { json: credentials }).json()
}

// 注册接口
export const registerApi = async (
    data: UserBaseRequest
): Promise<R<AuthResponse>> => {
    return api.post("auth/register", { json: data }).json()
}

// 登出接口
export const logoutApi = async (): Promise<R> => {
    return api.get("auth/logout").json()
}
