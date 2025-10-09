import "./Home.css"

import { A } from "@solidjs/router"
import {
    createMemo,
    createSignal,
    For,
    onCleanup,
    onMount,
    Show,
} from "solid-js"

import { getTopics, Topic } from "@/api/topic"
import { formatViewCount } from "@/utils/format"
import { formatActivityTime } from "@/utils/time"

// 防抖函数：延迟执行函数，避免频繁调用
const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: number | undefined
    return (...args: Parameters<T>) => {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func(...args), delay)
    }
}

const Home = () => {
    const [topics, setTopics] = createSignal<Topic[]>([])
    const [currentPage, setCurrentPage] = createSignal(1)
    const [isLoading, setIsLoading] = createSignal(false)
    const [hasMore, setHasMore] = createSignal(true)
    const [newTopicsCount, setNewTopicsCount] = createSignal(0)

    // DOM 引用和定时器
    let containerRef: HTMLDivElement | undefined
    let checkInterval: number | undefined

    // 使用 createMemo 缓存当前话题 ID 集合，避免重复计算
    const currentTopicIds = createMemo(() => new Set(topics().map((t) => t.id)))

    /**
     * 检查是否有新话题：定时获取最新话题，计算新增数量，但不主动刷新列表
     * 这实现了第一个功能：记录新话题数量，等待用户手动触发刷新
     */
    const checkForNewTopics = async () => {
        try {
            const data = await getTopics(1)
            const newCount = data.topics.filter(
                (t) => !currentTopicIds().has(t.id)
            ).length
            setNewTopicsCount(newCount)
        } catch (error) {
            console.error("检查新话题失败:", error)
        }
    }

    const refreshTopics = async () => {
        setIsLoading(true)
        try {
            const data = await getTopics(1)
            setTopics((prev) => {
                const existingMap = new Map(prev.map((t) => [t.id, t]))
                data.topics.forEach((t) => existingMap.set(t.id, t))
                const updated = [
                    ...data.topics,
                    ...prev.filter(
                        (t) => !data.topics.some((nt) => nt.id === t.id)
                    ),
                ]
                return updated
            })
            setNewTopicsCount(0)
        } catch (error) {
            console.error("刷新话题失败:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const loadTopics = async () => {
        if (isLoading() || !hasMore()) return

        setIsLoading(true)
        try {
            const data = await getTopics(currentPage())
            setTopics((prev) => [...prev, ...data.topics])
            if (data.topics.length === 0) {
                setHasMore(false)
            } else {
                setCurrentPage((prev) => prev + 1)
            }
        } catch (error) {
            console.error("加载话题失败:", error)
            setHasMore(false)
        } finally {
            setIsLoading(false)
        }
    }

    onMount(() => {
        // 初始加载第一页话题
        loadTopics()

        // 启动定时检查新话题（每10秒）
        checkInterval = window.setInterval(checkForNewTopics, 10000)

        // 滚动事件处理：检测滚动到底部时加载更多
        // 滚动事件处理：使用防抖优化，减少频繁调用
        const debouncedLoadTopics = debounce(loadTopics, 200)
        const handleScroll = () => {
            if (
                containerRef &&
                containerRef.scrollTop + containerRef.clientHeight >=
                    containerRef.scrollHeight - 100
            ) {
                debouncedLoadTopics()
            }
        }

        containerRef?.addEventListener("scroll", handleScroll)

        onCleanup(() => {
            containerRef?.removeEventListener("scroll", handleScroll)
            if (checkInterval) {
                window.clearInterval(checkInterval)
            }
        })
    })

    return (
        <div class="home">
            <div class="topics-container" ref={containerRef}>
                <table class="topics-table">
                    <thead>
                        <Show
                            when={newTopicsCount() > 0}
                            fallback={
                                <tr>
                                    <th class="col-topic">话题</th>
                                    <th class="col-users">用户</th>
                                    <th class="col-reply">回复</th>
                                    <th class="col-view">浏览</th>
                                    <th class="col-activity">活动</th>
                                </tr>
                            }
                        >
                            <tr>
                                <th
                                    colspan="5"
                                    class="refresh-header"
                                    onClick={refreshTopics}
                                >
                                    查看 {newTopicsCount()} 个新的或更新的话题
                                </th>
                            </tr>
                        </Show>
                    </thead>
                    <tbody>
                        <For each={topics()}>
                            {(topic) => (
                                <tr class="topic-row">
                                    <td class="topic-cell">
                                        <A
                                            href={`/topic/${topic.id}`}
                                            class="topic-title"
                                        >
                                            {topic.title}
                                        </A>
                                    </td>
                                    <td class="users-cell">
                                        <div class="user-avatars">
                                            <div
                                                class="user-avatar"
                                                title={`用户 ${topic.user_id}`}
                                            >
                                                {topic.user_id}
                                            </div>
                                        </div>
                                    </td>
                                    <td class="reply-cell">
                                        <span class="stat-number">
                                            {topic.post_count}
                                        </span>
                                    </td>
                                    <td class="view-cell">
                                        <span class="stat-number">
                                            {formatViewCount(topic.view_count)}
                                        </span>
                                    </td>
                                    <td class="activity-cell">
                                        {formatActivityTime(topic.created_at)}
                                    </td>
                                </tr>
                            )}
                        </For>
                    </tbody>
                </table>
                <Show when={isLoading()}>
                    <div class="loading">加载中...</div>
                </Show>
            </div>
        </div>
    )
}

export default Home
