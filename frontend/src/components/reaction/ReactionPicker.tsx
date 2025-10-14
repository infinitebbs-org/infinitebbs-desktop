import "./ReactionPicker.css"

import { For, Show } from "solid-js"
import toast from "solid-toast"

import { addReaction, Reaction } from "@/api/reaction"
import { reactionTypes } from "@/constants/reactions"
import reactionPickerStore from "@/store/reactionPicker"
import { userState } from "@/store/user"

interface ReactionPickerProps {
    onReactionAdd: (reaction: Reaction) => void
}

const ReactionPicker = (props: ReactionPickerProps) => {
    const handleReaction = async (kind: number) => {
        const { targetPost } = reactionPickerStore.state
        if (!targetPost) return

        try {
            const response = await addReaction({
                kind,
                topic_id: targetPost.topicId,
                post_number: targetPost.postNumber,
            })
            if (response.success) {
                toast.success("反应成功")
                const newReaction: Reaction = {
                    id: Date.now(),
                    topic_id: targetPost.topicId,
                    post_number: targetPost.postNumber,
                    user_id: userState.user!.id,
                    kind,
                    created_at: new Date().toISOString(),
                }
                props.onReactionAdd(newReaction)
                reactionPickerStore.actions.hideImmediately()
            } else {
                toast.error(response.message || "反应失败")
            }
        } catch (error) {
            console.error("反应失败:", error)
            toast.error("网络错误")
        }
    }

    return (
        <Show when={reactionPickerStore.state.isVisible}>
            <div
                class="global-reaction-picker"
                style={{
                    left: `${reactionPickerStore.state.position?.x}px`,
                    top: `${reactionPickerStore.state.position?.y}px`,
                }}
                onMouseEnter={() => reactionPickerStore.actions.cancelHide()}
                onMouseLeave={() => reactionPickerStore.actions.hide()}
            >
                <For each={reactionTypes}>
                    {(reaction) => (
                        <div
                            class="reaction-option"
                            title={reaction.label}
                            onClick={() => handleReaction(reaction.kind)}
                        >
                            <img
                                src={`/${reaction.icon}`}
                                alt={reaction.label}
                            />
                        </div>
                    )}
                </For>
            </div>
        </Show>
    )
}

export default ReactionPicker
