import "./PostItem.css"

import { createMemo, createResource } from "solid-js"
import toast from "solid-toast"

import { Post } from "@/api/post"
import { addReaction, Reaction } from "@/api/reaction"
import MarkdownContent from "@/components/markdown/MarkdownContent"
import { reactionTypes } from "@/constants/reactions"
import editorStore from "@/store/editor"
import reactionPickerStore from "@/store/reactionPicker"
import { userState } from "@/store/user"
import userProfileStore from "@/store/userProfile"
import { formatActivityTime, formatFullDateTime } from "@/utils/time"

interface PostItemProps {
    post: Post
    Reactions: () => Reaction[]
    onReactionAdd: (reaction: Reaction) => void
}

const PostItem = (props: PostItemProps) => {
    let reactionBtnRef: HTMLDivElement | undefined

    // 获取用户信息（使用全局缓存）
    const [userProfile] = createResource(
        () => props.post.user_id,
        (userId) => userProfileStore.actions.fetchUserProfile(userId)
    )

    const memoizedReactions = createMemo(() => props.Reactions())
    const memoizedDate = createMemo(() =>
        formatActivityTime(props.post.created_at)
    )
    const fullDateTime = createMemo(() =>
        formatFullDateTime(props.post.created_at)
    )
    const userReaction = createMemo(() => {
        const uid = userState.user?.id
        if (!uid) return undefined
        // 单次遍历找到属于当前用户的最新 reaction，避免额外分配或排序
        let latest: Reaction | undefined = undefined
        let latestTs = 0
        for (const r of memoizedReactions()) {
            if (r.user_id !== uid) continue
            const ts = Date.parse(r.created_at)
            if (isNaN(ts)) continue
            if (latest === undefined || ts > latestTs) {
                latest = r
                latestTs = ts
            }
        }
        return latest
    })
    const reactionIcon = createMemo(() => {
        const reaction = userReaction()
        if (reaction) {
            const type = reactionTypes.find((t) => t.kind === reaction.kind)
            return type ? `/${type.icon}` : "/like.svg"
        }
        return "/like.svg"
    })

    const handleMouseEnter = () => {
        if (reactionBtnRef) {
            reactionPickerStore.actions.show(
                reactionBtnRef,
                props.post.topic_id,
                props.post.post_number
            )
        }
    }

    const handleMouseLeave = () => {
        reactionPickerStore.actions.hide()
    }

    const handleLike = async (topicId: number, postNumber: number) => {
        try {
            const response = await addReaction({
                kind: 0,
                topic_id: topicId,
                post_number: postNumber,
            })
            if (response.success) {
                toast.success("点赞成功")
                // 添加到本地记录
                const newReaction: Reaction = {
                    id: Date.now(), // 临时ID
                    topic_id: topicId,
                    post_number: postNumber,
                    user_id: userState.user!.id,
                    kind: 0,
                    created_at: new Date().toISOString(),
                }
                props.onReactionAdd(newReaction)
            } else {
                toast.error(response.message || "点赞失败")
            }
        } catch (error) {
            console.error("点赞失败:", error)
            toast.error("网络错误")
        }
    }

    return (
        <div class="post-item">
            <div class="post-left">
                <div class="post-avatar">
                    <img
                        src="https://picsum.photos/100/100"
                        alt="用户头像"
                        class="post-item-user-avatar"
                    />
                </div>
            </div>

            <div class="post-main">
                <div class="post-header">
                    <div class="post-item-username">
                        <span>
                            {userProfile()?.name ||
                                `用户 ${props.post.user_id}`}
                        </span>
                    </div>
                    <div class="post-item-meta">
                        <span
                            class="post-item-created-at"
                            title={fullDateTime()}
                        >
                            {memoizedDate()}
                        </span>
                        <span class="post-item-number">
                            #{props.post.post_number}
                        </span>
                    </div>
                </div>
                <div class="post-content">
                    <MarkdownContent markdown={props.post.raw} />
                </div>
                <div class="post-actions">
                    {props.post.user_id !== userState.user?.id && (
                        <div
                            ref={reactionBtnRef}
                            class="post-action-btn"
                            title="点赞"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() =>
                                handleLike(
                                    props.post.topic_id,
                                    props.post.post_number
                                )
                            }
                        >
                            <img
                                src={reactionIcon()}
                                alt="点赞"
                                classList={{
                                    active: memoizedReactions().some(
                                        (r) => r.user_id === userState.user?.id
                                    ),
                                }}
                                class={`action-icon`}
                            />
                        </div>
                    )}
                    <div
                        class="post-action-btn reply-btn"
                        title="回复"
                        onClick={() =>
                            editorStore.actions.openEditor(
                                "reply",
                                props.post.topic_id,
                                props.post.post_number
                            )
                        }
                    >
                        <img src="/reply.svg" alt="回复" class="action-icon" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostItem
