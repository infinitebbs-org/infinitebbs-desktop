import "./TopicRow.css"

import { A } from "@solidjs/router"
import { createMemo, createResource } from "solid-js"

import { Topic } from "@/api/topic"
import { categories } from "@/store/categories"
import userProfileActions from "@/store/userProfile"
import { formatViewCount } from "@/utils/format"
import { formatActivityTime, formatFullDateTime } from "@/utils/time"

interface TopicRowProps {
    topic: Topic
}

const getActivityTooltip = (
    createdAt: string,
    updatedAt: string,
    postCount: number
): string => {
    const createdText = `创建日期: ${formatFullDateTime(createdAt)}`
    if (postCount > 0) {
        return `${createdText}\n最新: ${formatFullDateTime(updatedAt)}`
    }
    return createdText
}

const TopicRow = (props: TopicRowProps) => {
    const [userProfile] = createResource(
        () => props.topic.user_id,
        userProfileActions.actions.fetchUserProfile
    )

    const category = createMemo(() =>
        categories.find((c) => c.id === props.topic.category_id)
    )

    const getFormattedActivityTime = (
        createdAt: string,
        updatedAt: string,
        postCount: number
    ) => {
        if (postCount > 0) {
            return formatActivityTime(updatedAt)
        } else {
            return formatActivityTime(createdAt)
        }
    }

    return (
        <tr class="topic-row">
            <td class="topic-cell">
                <A href={`/topic/${props.topic.id}`} class="topic-title">
                    {props.topic.title}
                </A>
                <div class="category-info">
                    <div class="category-badge no-select">
                        <img
                            src={`/${category()?.icon || "layers.svg"}`}
                            alt={category()?.name}
                            class="category-icon"
                        />
                        <span class="category-name">
                            {category()?.name || "未知分类"}
                        </span>
                    </div>
                </div>
            </td>
            <td class="users-cell no-select">
                <div class="topic-row-user-avatars">
                    <img
                        src="https://picsum.photos/40/40"
                        alt={`${
                            userProfile()?.name || `用户 ${props.topic.user_id}`
                        }`}
                        title={`${
                            userProfile()?.name || `用户 ${props.topic.user_id}`
                        }`}
                        class="user-avatar"
                    />
                </div>
            </td>
            <td class="reply-cell no-select">
                <span class="stat-number">{props.topic.post_count}</span>
            </td>
            <td class="view-cell no-select">
                <span class="stat-number">
                    {formatViewCount(props.topic.view_count)}
                </span>
            </td>
            <td
                class="activity-cell no-select"
                title={getActivityTooltip(
                    props.topic.created_at,
                    props.topic.updated_at,
                    props.topic.post_count
                )}
            >
                {getFormattedActivityTime(
                    props.topic.created_at,
                    props.topic.updated_at,
                    props.topic.post_count
                )}
            </td>
        </tr>
    )
}

export default TopicRow
