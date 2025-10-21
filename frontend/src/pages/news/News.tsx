import "./News.css"

import { debounce } from "@solid-primitives/scheduled"
import { OverlayScrollbarsComponent } from "overlayscrollbars-solid"
import { createMemo, For, Show } from "solid-js"

import TopicRow from "@/components/topic/TopicRow"
import { loadTopics, refreshTopics, topicState } from "@/store/topic"

const News = () => {
    // 筛选分类 ID 为 2 的话题
    const filteredTopics = createMemo(() =>
        topicState.topics.filter((topic) => topic.category_id === 2)
    )

    // 滚动事件处理：检测滚动到底部时加载更多
    const debouncedLoadTopics = debounce(loadTopics, 200)
    const handleScroll = () => {
        const viewport = document.querySelector(".news .os-viewport")
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
            class="news"
            options={{ scrollbars: { autoHide: "scroll" } }}
            events={{ scroll: handleScroll }}
            defer
        >
            <table class="news-topics-table">
                <thead>
                    <Show
                        when={topicState.newTopicsCount > 0}
                        fallback={
                            <tr>
                                <th class="news-col-topic no-select">话题</th>
                                <th class="news-col-users no-select" />
                                <th class="news-col-reply no-select">回复</th>
                                <th class="news-col-view no-select">浏览</th>
                                <th class="news-col-activity no-select">
                                    活动
                                </th>
                            </tr>
                        }
                    >
                        <tr>
                            <th
                                colspan="5"
                                class="news-refresh-header"
                                onClick={refreshTopics}
                            >
                                查看 {topicState.newTopicsCount}{" "}
                                个新的或更新的话题
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
                <div class="news-loading">加载中...</div>
            </Show>
        </OverlayScrollbarsComponent>
    )
}

export default News
