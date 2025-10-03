import { API_ENDPOINT, API_CONFIG } from "./config"

// API 响应类型
export interface ApiResponse<T = any> {
    success: boolean
    message?: string
    data?: T
}

// API 错误类
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public response?: any
    ) {
        super(message)
        this.name = "ApiError"
    }
}

// 获取认证 token
const getAuthToken = (): string | null => {
    return localStorage.getItem("access_token")
}

// 通用请求函数
const request = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> => {
    const url = `${API_ENDPOINT}${endpoint}`
    const token = getAuthToken()

    // 合并请求头
    const headers: Record<string, string> = {
        ...API_CONFIG.headers,
        ...(options.headers as Record<string, string>),
    }

    // 如果有 token，添加到请求头
    if (token) {
        headers["Authorization"] = `${token}`
    }

    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout)

        const response = await fetch(url, {
            ...options,
            headers,
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        // 解析响应
        let data: ApiResponse<T>
        const contentType = response.headers.get("content-type")

        if (contentType && contentType.includes("application/json")) {
            data = await response.json()
        } else {
            throw new ApiError("Invalid response format", response.status)
        }

        // 检查响应状态
        if (!response.ok) {
            throw new ApiError(
                data.message || `Request failed with status ${response.status}`,
                response.status,
                data
            )
        }

        return data
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }

        if (error instanceof Error) {
            if (error.name === "AbortError") {
                throw new ApiError("Request timeout")
            }
            throw new ApiError(error.message)
        }

        throw new ApiError("Unknown error occurred")
    }
}

// GET 请求
export const get = async <T = any>(
    endpoint: string,
    options?: RequestInit
): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, {
        ...options,
        method: "GET",
    })
}

// POST 请求
export const post = async <T = any>(
    endpoint: string,
    data?: any,
    options?: RequestInit
): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, {
        ...options,
        method: "POST",
        body: JSON.stringify(data),
    })
}

// PUT 请求
export const put = async <T = any>(
    endpoint: string,
    data?: any,
    options?: RequestInit
): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, {
        ...options,
        method: "PUT",
        body: JSON.stringify(data),
    })
}

// DELETE 请求
export const del = async <T = any>(
    endpoint: string,
    options?: RequestInit
): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, {
        ...options,
        method: "DELETE",
    })
}

// PATCH 请求
export const patch = async <T = any>(
    endpoint: string,
    data?: any,
    options?: RequestInit
): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, {
        ...options,
        method: "PATCH",
        body: JSON.stringify(data),
    })
}
