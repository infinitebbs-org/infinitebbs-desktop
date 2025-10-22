import "./Home.css"

import { debounce } from "@solid-primitives/scheduled"
import { OverlayScrollbarsComponent } from "overlayscrollbars-solid"
import { createMemo, For, Show } from "solid-js"

import TopicRow from "@/components/topic/TopicRow"
import { loadTopics, refreshTopics, topicState } from "@/store/topic"

const Home = () => {
    // 计算新话题数量（所有分类）
    const newTopicsCount = createMemo(() => topicState.pendingTopics.size)

    // 滚动事件处理：检测滚动到底部时加载更多
    const debouncedLoadTopics = debounce(loadTopics, 200)
    const handleScroll = (instance: any) => {
        const viewport = instance.elements().viewport
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
            class="home"
            options={{ scrollbars: { autoHide: "scroll" } }}
            events={{ scroll: handleScroll }}
            defer
        >
            <table class="topics-table">
                <thead>
                    <Show
                        when={newTopicsCount() > 0}
                        fallback={
                            <tr>
                                <th class="col-topic no-select">话题</th>
                                <th class="col-users no-select" />
                                <th class="col-reply no-select">回复</th>
                                <th class="col-view no-select">浏览</th>
                                <th class="col-activity no-select">活动</th>
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
                    <For each={topicState.topics}>
                        {(topic) => <TopicRow topic={topic} />}
                    </For>
                </tbody>
            </table>
            <Show when={topicState.isLoading}>
                <div class="loading">加载中...</div>
            </Show>
        </OverlayScrollbarsComponent>
    )
}

export default Home
