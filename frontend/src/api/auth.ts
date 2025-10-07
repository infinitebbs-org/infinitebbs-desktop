import type { ApiResponse } from "./client"
import { get, post } from "./client"

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
): Promise<ApiResponse<AuthResponse>> => {
    return post<AuthResponse>("/auth/login", credentials)
}

// 注册接口
export const registerApi = async (
    data: UserBaseRequest
): Promise<ApiResponse<AuthResponse>> => {
    return post<AuthResponse>("/auth/register", data)
}

// 登出接口
export const logoutApi = async (): Promise<ApiResponse> => {
    return get("/auth/logout")
}
