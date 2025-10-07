// Post 相关类型定义
export interface Post {
    topic_id: number
    post_number: number
    user_id: number
    raw: string
    cooked: string
    created_at: string
}

import { ApiResponse,get } from "./client"

// 根据 topic_id 获取所有 posts
export const getPostsByTopicId = async (topicId: number): Promise<ApiResponse<{ posts: Post[]; total: number }>> => {
    return get<{ posts: Post[]; total: number }>(`/topic/${topicId}/posts`)
}
