import "./Home.css"

import { A } from "@solidjs/router"
import { For, onCleanup, onMount, Show } from "solid-js"

import { loadTopics, refreshTopics, topicState } from "@/store/topic"
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
    // DOM 引用
    let containerRef: HTMLDivElement | undefined

    onMount(() => {
        // 滚动事件处理：检测滚动到底部时加载更多
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
        })
    })

    return (
        <div class="home">
            <div class="topics-container" ref={containerRef}>
                <table class="topics-table">
                    <thead>
                        <Show
                            when={topicState.newTopicsCount > 0}
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
                                    查看 {topicState.newTopicsCount}{" "}
                                    个新的或更新的话题
                                </th>
                            </tr>
                        </Show>
                    </thead>
                    <tbody>
                        <For each={topicState.topics}>
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
                <Show when={topicState.isLoading}>
                    <div class="loading">加载中...</div>
                </Show>
            </div>
        </div>
    )
}

export default Home
