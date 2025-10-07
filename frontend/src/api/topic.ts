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

// 创建回复的请求接口
export interface CreatePostRequest {
    content: string
    reply?: number
}

// 创建回复的响应接口
export interface CreatePostResponse {
    topic_id: number
    post_number: number
}
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

// 查看主题的响应接口
export interface ViewTopicResponse {
    success: boolean
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

// 回复主题的 API 函数
export const replyToTopic = async (topicId: number, data: CreatePostRequest): Promise<CreatePostResponse> => {
    const response = await post<CreatePostResponse>(`/topic/${topicId}`, data)
    return response.data!
}

// 查看主题的 API 函数
export const viewTopic = async (topicId: number): Promise<ViewTopicResponse> => {
    const response = await post<ViewTopicResponse>(`/topic/${topicId}/view`)
    return response.data!
}
