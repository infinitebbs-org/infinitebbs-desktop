import "./Talk.css"

import { OverlayScrollbarsComponent } from "overlayscrollbars-solid"
import { createMemo, createSignal, For, onMount, Show } from "solid-js"

import { getTopics } from "@/api/topic"
import SmallLoading from "@/components/loading/SmallLoading"
import TopicRow from "@/components/topic/TopicRow"
import { refreshTopics, setTopicState, topicState } from "@/store/topic"

const Talk = () => {
    const [currentPage, setCurrentPage] = createSignal(1)
    const [isLoading, setIsLoading] = createSignal(false)
    let lastScrollTop = 0
    let canTrigger = true

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

    // 加载更多话题
    const loadTopics = async () => {
        if (isLoading()) return

        setIsLoading(true)
        try {
            const resp = await getTopics(currentPage(), 1)
            if (resp.success) {
                setTopicState("topics", (prev) => {
                    const existingIds = new Set(prev.map((t) => t.id))
                    const newTopics = resp.data!.topics.filter(
                        (t) => !existingIds.has(t.id)
                    )
                    return [...prev, ...newTopics]
                })
                if (resp.data!.topics.length !== 0) {
                    setCurrentPage((prev) => prev + 1)
                }
            }
        } catch (error) {
            console.error("加载话题失败:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // 滚动事件处理：检测滚动到底部时加载更多
    const handleScroll = (instance: any) => {
        const viewport = instance.elements().viewport
        if (viewport) {
            const currentScrollTop = viewport.scrollTop
            if (currentScrollTop > lastScrollTop && canTrigger) {
                if (
                    viewport.scrollTop + viewport.clientHeight >=
                    viewport.scrollHeight - 100
                ) {
                    loadTopics()
                    canTrigger = false
                    setTimeout(() => (canTrigger = true), 500)
                }
            }
            lastScrollTop = currentScrollTop
        }
    }

    onMount(() => {
        loadTopics()
    })

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
            <Show when={isLoading()}>
                <SmallLoading />
            </Show>
        </OverlayScrollbarsComponent>
    )
}

export default Talk
