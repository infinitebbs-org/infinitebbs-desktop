import "./Talk.css"

import { debounce } from "@solid-primitives/scheduled"
import { OverlayScrollbarsComponent } from "overlayscrollbars-solid"
import { createMemo, For, Show } from "solid-js"

import TopicRow from "@/components/topic/TopicRow"
import { loadTopics, refreshTopics, topicState } from "@/store/topic"

const Talk = () => {
    // 筛选分类 ID 为 1 的话题
    const filteredTopics = createMemo(() =>
        topicState.topics.filter((topic) => topic.category_id === 1)
    )

    // 计算新话题数量（分类 ID 为 1）
    const newTopicsCount = createMemo(
        () =>
            Array.from(topicState.pendingTopics.values()).filter(
                (topic) => topic.category_id === 1
            ).length
    )

    // 滚动事件处理：检测滚动到底部时加载更多
    const debouncedLoadTopics = debounce(loadTopics, 200)
    const handleScroll = () => {
        const viewport = document.querySelector(".talk .os-viewport")
        if (viewport) {
            if (
                viewport.scrollTop + viewport.clientHeight >=
                viewport.scrollHeight - 100
            ) {
                debouncedLoadTopics()
            }
        }
    }

    return (
        <OverlayScrollbarsComponent
            class="talk"
            options={{ scrollbars: { autoHide: "scroll" } }}
            events={{ scroll: handleScroll }}
            defer
        >
            <table class="talk-topics-table">
                <thead>
                    <Show
                        when={newTopicsCount() > 0}
                        fallback={
                            <tr>
                                <th class="talk-col-topic no-select">话题</th>
                                <th class="talk-col-users no-select" />
                                <th class="talk-col-reply no-select">回复</th>
                                <th class="talk-col-view no-select">浏览</th>
                                <th class="talk-col-activity no-select">
                                    活动
                                </th>
                            </tr>
                        }
                    >
                        <tr>
                            <th
                                colspan="5"
                                class="talk-refresh-header"
                                onClick={refreshTopics}
                            >
                                查看 {newTopicsCount()} 个新的或更新的话题
                            </th>
                        </tr>
                    </Show>
                </thead>
                <tbody>
                    <For each={filteredTopics()}>
                        {(topic) => <TopicRow topic={topic} />}
                    </For>
                </tbody>
            </table>
            <Show when={topicState.isLoading}>
                <div class="talk-loading">加载中...</div>
            </Show>
        </OverlayScrollbarsComponent>
    )
}

export default Talk
