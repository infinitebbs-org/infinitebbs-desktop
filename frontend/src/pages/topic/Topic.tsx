import { createSignal, onMount, For, Show } from "solid-js"
import { useParams } from "@solidjs/router"
import { getPostsByTopicId, Post } from "@/api/post"
import PostItem from "@/components/post/PostItem"

import "./Topic.css"

const Topic = () => {
    const params = useParams()
    const topicId = () => parseInt(params.id)

    const [posts, setPosts] = createSignal<Post[]>([])
    const [isLoading, setIsLoading] = createSignal(true)
    const [error, setError] = createSignal<string | null>(null)

    onMount(async () => {
        try {
            const response = await getPostsByTopicId(topicId())
            if (response.success && response.data) {
                setPosts(response.data.posts)
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
        <div class="topic-page">
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
                            {(post) => <PostItem post={post} />}
                        </For>
                    </div>
                </div>
            </Show>
        </div>
    )
}

export default Topic
