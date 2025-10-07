import "./Home.css"

import { A } from "@solidjs/router"
import { createSignal, For, onCleanup, onMount, Show } from "solid-js"

import { getTopics, Topic } from "@/api/topic"

const Home = () => {
    const [topics, setTopics] = createSignal<Topic[]>([])
    const [currentPage, setCurrentPage] = createSignal(1)
    const [isLoading, setIsLoading] = createSignal(false)
    const [hasMore, setHasMore] = createSignal(true)

    let containerRef: HTMLDivElement | undefined

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
        loadTopics()

        const handleScroll = () => {
            if (
                containerRef &&
                containerRef.scrollTop + containerRef.clientHeight >=
                    containerRef.scrollHeight - 100
            ) {
                loadTopics()
            }
        }

        containerRef?.addEventListener("scroll", handleScroll)

        onCleanup(() => {
            containerRef?.removeEventListener("scroll", handleScroll)
        })
    })

    return (
        <div class="home">
            <div class="topics-container" ref={containerRef}>
                <table class="topics-table">
                    <thead>
                        <tr>
                            <th class="col-topic">话题</th>
                            <th class="col-users">用户</th>
                            <th class="col-reply">回复</th>
                            <th class="col-view">浏览</th>
                            <th class="col-activity">活动</th>
                        </tr>
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
                                            {topic.view_count > 1000
                                                ? `${(
                                                      topic.view_count / 1000
                                                  ).toFixed(1)}k`
                                                : topic.view_count}
                                        </span>
                                    </td>
                                    <td class="activity-cell">
                                        {(() => {
                                            const now = new Date()
                                            const created = new Date(
                                                topic.created_at
                                            )
                                            const diff =
                                                now.getTime() -
                                                created.getTime()
                                            const minutes = Math.floor(
                                                diff / 60000
                                            )
                                            const hours = Math.floor(
                                                diff / 3600000
                                            )
                                            const days = Math.floor(
                                                diff / 86400000
                                            )
                                            if (minutes < 60)
                                                return `${minutes} 分钟`
                                            if (hours < 24)
                                                return `${hours} 小时`
                                            return `${days} 天`
                                        })()}
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
