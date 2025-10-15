import { api, R } from "."

export interface Reaction {
    id: number
    topic_id: number
    post_number: number
    user_id: number
    kind: number
    created_at: string
}


export interface AddReactionRequest {
    kind: number
    topic_id: number
    post_number: number
}

// 获取主题反应的 API 函数
export const getReactionsForTopic = async (topicId: number): Promise<Reaction[]> => {
    const response = await api.get(`reaction/topic/${topicId}`).json<R<Reaction[]>>()
    return response.data || []
}

// 添加反应的 API 函数
export const addReaction = async (data: AddReactionRequest): Promise<R> => {
    return api.post("reaction", { json: data }).json()
}
