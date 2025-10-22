import "./Home.css"

import { OverlayScrollbarsComponent } from "overlayscrollbars-solid"
import { createMemo, createSignal, For, onMount, Show } from "solid-js"

import { getTopics } from "@/api/topic"
import SmallLoading from "@/components/loading/SmallLoading"
import TopicRow from "@/components/topic/TopicRow"
import { refreshTopics, setTopicState, topicState } from "@/store/topic"

const Home = () => {
    const [currentPage, setCurrentPage] = createSignal(1)
    const [isLoading, setIsLoading] = createSignal(false)
    let lastScrollTop = 0
    let canTrigger = true

    // 计算新话题数量（所有分类）
    const newTopicsCount = createMemo(() => topicState.pendingTopics.size)

    // 加载更多话题
    const loadTopics = async () => {
        if (isLoading()) return

        setIsLoading(true)
        try {
            const resp = await getTopics(currentPage())
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
            <Show when={isLoading()}>
                <SmallLoading />
            </Show>
        </OverlayScrollbarsComponent>
    )
}

export default Home
