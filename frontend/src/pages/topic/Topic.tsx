import "./Topic.css"

import { useParams } from "@solidjs/router"
import { OverlayScrollbarsComponent } from "overlayscrollbars-solid"
import { createMemo, createSignal, For, onMount, Show } from "solid-js"

import { getPostsByTopicId, Post } from "@/api/post"
import { getReactionsForTopic, Reaction } from "@/api/reaction"
import { viewTopic } from "@/api/topic"
import PostItem from "@/components/post/PostItem"
import ReactionPicker from "@/components/reaction/ReactionPicker"

const Topic = () => {
    const params = useParams()
    const topicId = createMemo(() => parseInt(params.id))

    const [posts, setPosts] = createSignal<Post[]>([])
    const [isLoading, setIsLoading] = createSignal(true)
    const [error, setError] = createSignal<string | null>(null)
    const [userReactions, setUserReactions] = createSignal<Reaction[]>([])

    onMount(async () => {
        try {
            const response = await getPostsByTopicId(topicId())
            if (response.success && response.data) {
                setPosts(response.data.posts)
                await viewTopic(topicId())

                // 获取反应数据
                const reactions = await getReactionsForTopic(topicId())
                setUserReactions(reactions)
            } else {
                setError("加载帖子失败")
            }
        } catch (err) {
            console.error("获取帖子详情失败:", err)
            setError("网络错误，请稍后重试")
        } finally {
            setIsLoading(false)
        }
    })

    return (
        <OverlayScrollbarsComponent
            class="topic-page"
            options={{ scrollbars: { autoHide: "scroll" } }}
            defer
        >
            <ReactionPicker
                onReactionAdd={(reaction) =>
                    setUserReactions([...userReactions(), reaction])
                }
            />
            <Show when={isLoading()}>
                <div class="loading">加载中...</div>
            </Show>
            <Show when={error()}>
                <div class="error">{error()}</div>
            </Show>
            <Show when={!isLoading() && !error()}>
                <div class="posts-container">
                    <div class="posts-list">
                        <For each={posts()}>
                            {(post) => (
                                <PostItem
                                    post={post}
                                    Reactions={() =>
                                        userReactions().filter(
                                            (reaction) =>
                                                reaction.post_number ===
                                                post.post_number
                                        )
                                    }
                                    onReactionAdd={(reaction) =>
                                        setUserReactions([
                                            ...userReactions(),
                                            reaction,
                                        ])
                                    }
                                />
                            )}
                        </For>
                    </div>
                </div>
            </Show>
        </OverlayScrollbarsComponent>
    )
}

export default Topic
