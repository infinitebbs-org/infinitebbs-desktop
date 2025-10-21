import { createStore } from "solid-js/store"

import { getTopics, Topic } from "@/api/topic"
import { sleep } from "@/utils/scheduler"

import { userState } from "./user"

interface TopicState {
    topics: Topic[]
    pendingTopics: Map<number, Topic>
    currentPage: number
    isLoading: boolean
    newTopicsCount: number
}

const [topicState, setTopicState] = createStore<TopicState>({
    topics: [],
    pendingTopics: new Map(),
    currentPage: 1,
    isLoading: false,
    newTopicsCount: 0,
})

// 导出状态
export { topicState }

// 加载更多话题
export const loadTopics = async () => {
    if (topicState.isLoading) return

    setTopicState("isLoading", true)
    try {
        const resp = await getTopics(topicState.currentPage)
        if (resp.success) {
            setTopicState("topics", prev => [...prev, ...resp.data!.topics])
        }
        if (resp.data!.topics.length !== 0) {
            setTopicState("currentPage", prev => prev + 1)
        }
    } catch (error) {
        console.error("加载话题失败:", error)
    } finally {
        setTopicState("isLoading", false)
    }
}

// 刷新话题 - 用户手动触发，合并 pendingTopics 到 topics
export const refreshTopics = async () => {
    setTopicState("isLoading", true)
    try {
        // 将 pendingTopics 合并到 topics 中
        setTopicState("topics", prev => {
            const existingTopics = prev.filter(t => !topicState.pendingTopics.has(t.id))
            return [...Array.from(topicState.pendingTopics.values()), ...existingTopics]
        })

        // 清空 pendingTopics 和计数
        setTopicState("pendingTopics", new Map())
        setTopicState("newTopicsCount", 0)
    } catch (error) {
        console.error("刷新话题失败:", error)
    } finally {
        setTopicState("isLoading", false)
    }
}

// 检查新话题 - 定时执行，更新 pendingTopics
const checkForNewTopics = async () => {
    try {
        // 检测用户是否登录
        if (!userState.user) return

        const resp = await getTopics(1)
        if (resp.success) {
            const latestTopics = resp.data!.topics

            // 复制当前的 pendingTopics Map
            const newPendingMap = new Map(topicState.pendingTopics)

            // 检查最新的话题，直接 set 进去
            latestTopics.forEach(topic => {
                if (newPendingMap.has(topic.id)) {
                    newPendingMap.set(topic.id, topic)
                    return
                }

                const existingTopic = topicState.topics.find(t => t.id === topic.id);
                if (topic.updated_at !== existingTopic?.updated_at) {
                    newPendingMap.set(topic.id, topic)
                    return
                }

                if (topic.view_count !== existingTopic?.view_count) {

                    // 直接更新 topics 中的数据
                    setTopicState("topics", prev =>
                        prev.map(t => t.id === topic.id ? topic : t)
                    )
                    return
                }


            })

            // 更新 pendingTopics
            setTopicState("pendingTopics", newPendingMap)
            setTopicState("newTopicsCount", newPendingMap.size)
        }
    } catch (error) {
        console.error("检查新话题失败:", error)
    }
}

export const initTopics = async () => {
    // 加载第一页话题
    await loadTopics()

    // 启动定时检查新话题（递归调度，避免重叠）
    while (true) {
        await sleep(10000) // 每10秒检查一次
        checkForNewTopics()
    }
}