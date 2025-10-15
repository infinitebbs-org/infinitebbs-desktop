import ky from "ky"

import { API_CONFIG, API_ENDPOINT } from "./config"
export interface R<T = any> {
    success: boolean
    message?: string
    data?: T
}

// helper to read token
const getAuthToken = (): string | null => localStorage.getItem("access_token")

// create a configured ky instance
export const api = ky.extend({
    prefixUrl: API_ENDPOINT,
    timeout: API_CONFIG.timeout,
    headers: API_CONFIG.headers,
    throwHttpErrors: false,
    hooks: {
        beforeRequest: [request => {
            const token = getAuthToken()
            if (token) request.headers.set("Authorization", token)
        }]
    }
})


