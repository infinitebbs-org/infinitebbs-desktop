import { createStore } from "solid-js/store"
import toast from "solid-toast"

import { CreatePostRequest, createTopic, CreateTopicRequest, replyToTopic } from "@/api/topic"

interface EditorState {
    isOpen: boolean
    mode: 'create' | 'reply'
    title: string
    content: string
    category: number
    tags: string
    height: number
    topicId?: number
    replyId?: number
}

const [editorState, setEditorState] = createStore<EditorState>({
    isOpen: false,
    mode: 'create',
    title: "",
    content: "",
    category: 1,
    tags: "",
    height: 300,
})

const resetEditorState = () => {
    setEditorState({
        isOpen: false,
        mode: 'create',
        title: "",
        content: "",
        category: 1,
        tags: "",
        topicId: undefined,
        replyId: undefined,
    })
}

const editorStore = {
    state: editorState,
    actions: {
        openEditor: (mode: 'create' | 'reply' = 'create', topicId?: number, replyId?: number) => {
            setEditorState({
                isOpen: true,
                mode,
                topicId,
                replyId,
            })
        },
        closeEditor: () => {
            resetEditorState()
        },
        setTitle: (title: string) => setEditorState("title", title),
        setContent: (content: string) => setEditorState("content", content),
        setCategory: (category: number) => setEditorState("category", category),
        setTags: (tags: string) => setEditorState("tags", tags),
        setHeight: (height: number) => setEditorState("height", height),
        publish: async (): Promise<{ success: boolean; topicId?: number }> => {
            try {
                if (editorState.mode === 'create') {
                    const data: CreateTopicRequest = {
                        title: editorState.title,
                        content: editorState.content,
                        category: editorState.category,
                        tags: editorState.tags,
                    }
                    const resp = await createTopic(data)
                    if (resp.success) {
                        toast.success("话题发布成功")
                        editorStore.actions.closeEditor()
                        return { success: true, topicId: resp.data?.id }
                    } else {
                        toast.error(resp.message || "话题发布失败")
                        return { success: false }
                    }
                } else if (editorState.mode === 'reply' && editorState.topicId !== undefined) {
                    const data: CreatePostRequest = {
                        content: editorState.content,
                        reply: editorState.replyId,
                    }
                    const resp = await replyToTopic(editorState.topicId, data)
                    if (resp.success) {
                        toast.success("回复发布成功")
                        editorStore.actions.closeEditor()
                        return { success: true }
                    } else {
                        toast.error(resp.message || "回复发布失败")
                        return { success: false }
                    }
                }
                return { success: false }
            } catch (error) {
                console.error("发布失败:", error)
                toast.error("发布失败")
                return { success: false }
            }
        },
    },
}

export default editorStore