import { Post } from "@/api/post"
import "./PostItem.css"

interface PostItemProps {
    post: Post
}

const PostItem = (props: PostItemProps) => {
    return (
        <div class="post-item">
            <div class="post-avatar">
                <img
                    src="https://picsum.photos/40/40"
                    alt="用户头像"
                    class="post-item-user-avatar"
                />
            </div>
            <div class="post-main">
                <div class="post-header">
                    <div class="post-item-user-info">
                        <span class="post-item-username">
                            用户 {props.post.user_id}
                        </span>
                    </div>
                    <div class="post-item-meta">
                        <span class="post-item-created-at">
                            {new Date(props.post.created_at).toLocaleString()}
                        </span>
                        <span class="post-item-number">
                            #{props.post.post_number}
                        </span>
                    </div>
                </div>
                <div class="post-content">
                    <div innerHTML={props.post.cooked}></div>
                </div>
                <div class="post-actions">
                    <div class="post-action-btn" title="点赞">
                        <img src="/like.svg" alt="点赞" class="action-icon" />
                    </div>
                    <div class="post-action-btn" title="回复">
                        <img src="/reply.svg" alt="回复" class="action-icon" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostItem
