// Post 相关类型定义
export interface Post {
    topic_id: number
    post_number: number
    user_id: number
    raw: string
    cooked: string
    created_at: string
}

import { api, R } from "."

// 根据 topic_id 获取所有 posts
export const getPostsByTopicId = async (topicId: number): Promise<R<{ posts: Post[]; total: number }>> => {
    return api.get(`topic/${topicId}/posts`).json()
}
