import "./TopicRow.css"

import { A } from "@solidjs/router"
import { createResource } from "solid-js"

import { Topic } from "@/api/topic"
import userProfileActions from "@/store/userProfile"
import { formatViewCount } from "@/utils/format"
import { formatActivityTime, formatFullDateTime } from "@/utils/time"

interface TopicRowProps {
    topic: Topic
    tick: number
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
            </td>
            <td class="users-cell">
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
            <td class="reply-cell">
                <span class="stat-number">{props.topic.post_count}</span>
            </td>
            <td class="view-cell">
                <span class="stat-number">
                    {formatViewCount(props.topic.view_count)}
                </span>
            </td>
            <td
                class="activity-cell"
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
