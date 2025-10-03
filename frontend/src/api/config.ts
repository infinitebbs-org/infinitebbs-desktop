// API 配置
export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || "http://localhost:9880/api/v1"

// API 请求配置
export const API_CONFIG = {
    timeout: 10000, // 请求超时时间（毫秒）
    headers: {
        "Content-Type": "application/json",
    },
}
