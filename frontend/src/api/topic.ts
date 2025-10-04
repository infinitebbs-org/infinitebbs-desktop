import { post, get } from "./client"

// 创建主题的请求接口
export interface CreateTopicRequest {
    title: string
    content: string
}

// 创建主题的响应接口
export interface CreateTopicResponse {
    id: number
}

// 主题接口
export interface Topic {
    id: number
    user_id: number
    title: string
    post_count: number
    view_count: number
    created_at: string
    updated_at: string
}

// 获取主题列表的响应接口
export interface GetTopicsResponse {
    topics: Topic[]
    total: number
}

// 创建主题的 API 函数
export const createTopic = async (data: CreateTopicRequest): Promise<CreateTopicResponse> => {
    const response = await post<CreateTopicResponse>("/topic", data)
    return response.data!
}

// 获取主题列表的 API 函数
export const getTopics = async (page: number): Promise<GetTopicsResponse> => {
    const response = await get<GetTopicsResponse>(`/topic/page/${page}`)
    return response.data!
}
