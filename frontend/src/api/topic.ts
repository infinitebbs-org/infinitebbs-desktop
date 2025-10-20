import { api, R } from "."

// 创建主题的请求接口
export interface CreateTopicRequest {
    title: string
    content: string
    category: number
    tags: string
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

export interface GetTopicsResponse {
    topics: Topic[]
    total: number
}

// 分类接口
export interface Category {
    id: number
    name: string
    description: string
    topic_count: number
    slug: string
}

export type GetCategoriesResponse = Category[]



// 创建主题的 API 函数
export const createTopic = async (data: CreateTopicRequest): Promise<R<CreateTopicResponse>> => {
    return await api.post("topic", { json: data }).json<R<CreateTopicResponse>>()
}

// 获取主题列表的 API 函数
export const getTopics = async (page: number): Promise<R<GetTopicsResponse>> => {
    return await api.get(`topic/page/${page}`).json<R<GetTopicsResponse>>()
}

// 回复主题的 API 函数
export const replyToTopic = async (topicId: number, data: CreatePostRequest): Promise<R<CreatePostResponse>> => {
    return await api.post(`topic/${topicId}`, { json: data }).json<R<CreatePostResponse>>()
}

// 查看主题的 API 函数
export const viewTopic = async (topicId: number): Promise<R> => {
    return await api.post(`topic/${topicId}/view`).json<R>()
}

// 获取分类列表的 API 函数
export const getCategories = async (): Promise<R<GetCategoriesResponse>> => {
    return await api.get("category").json<R<GetCategoriesResponse>>()
}
