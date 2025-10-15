import { createStore } from "solid-js/store"

import { getTopics, Topic } from "@/api/topic"

import { userState } from "./user"

interface TopicState {
    topics: Topic[]
    currentPage: number
    isLoading: boolean
    hasMore: boolean
    newTopicsCount: number
}

const [topicState, setTopicState] = createStore<TopicState>({
    topics: [],
    currentPage: 1,
    isLoading: false,
    hasMore: true,
    newTopicsCount: 0,
})

// 导出状态
export { topicState }

// 加载更多话题
export const loadTopics = async () => {
    if (topicState.isLoading || !topicState.hasMore) return

    setTopicState("isLoading", true)
    try {
        const resp = await getTopics(topicState.currentPage)
        if (resp.success) {
            setTopicState("topics", prev => [...prev, ...resp.data!.topics])
        }
        if (resp.data!.topics.length === 0) {
            setTopicState("hasMore", false)
        } else {
            setTopicState("currentPage", prev => prev + 1)
        }
    } catch (error) {
        console.error("加载话题失败:", error)
        setTopicState("hasMore", false)
    } finally {
        setTopicState("isLoading", false)
    }
}

// 刷新话题
export const refreshTopics = async () => {
    setTopicState("isLoading", true)
    try {
        const resp = await getTopics(1)
        if (resp.success) {
            setTopicState("topics", prev => {
                const existingMap = new Map(prev.map(t => [t.id, t]))
                resp.data!.topics.forEach(t => existingMap.set(t.id, t))
                return [...resp.data!.topics, ...prev.filter(t => !resp.data!.topics.some(nt => nt.id === t.id))]
            })
        }
        setTopicState("newTopicsCount", 0)
    } catch (error) {
        console.error("刷新话题失败:", error)
    } finally {
        setTopicState("isLoading", false)
    }
}

// 检查新话题
const currentTopicIds = () => new Set(topicState.topics.map(t => t.id))

const checkForNewTopics = async () => {
    try {
        // 检测用户是否登录
        if (!userState.user) return
        const resp = await getTopics(1)
        if (resp.success) {
            const newCount = resp.data!.topics.filter(t => !currentTopicIds().has(t.id)).length
            setTopicState("newTopicsCount", newCount)
        }
    } catch (error) {
        console.error("检查新话题失败:", error)
    }
}

export const initTopics = () => {
    // 加载第一页话题
    loadTopics()

    // 启动定时检查新话题（每10秒）
    window.setInterval(checkForNewTopics, 10000)
}