import { createStore } from "solid-js/store"
import toast from "solid-toast"

import { CreatePostRequest, createTopic, CreateTopicRequest, replyToTopic } from "@/api/topic"

interface EditorState {
    isOpen: boolean
    mode: 'create' | 'reply'
    title: string
    content: string
    height: number
    topicId?: number
    replyId?: number
}

const [editorState, setEditorState] = createStore<EditorState>({
    isOpen: false,
    mode: 'create',
    title: "",
    content: "",
    height: 300,
})

const resetEditorState = () => {
    setEditorState({
        isOpen: false,
        mode: 'create',
        title: "",
        content: "",
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
        setHeight: (height: number) => setEditorState("height", height),
        publish: async () => {
            try {
                if (editorState.mode === 'create') {
                    const data: CreateTopicRequest = {
                        title: editorState.title,
                        content: editorState.content,
                    }
                    const resp = await createTopic(data)
                    if (resp.success) {
                        toast.success("话题发布成功")
                    } else {
                        toast.error(resp.message || "话题发布失败")
                    }
                } else if (editorState.mode === 'reply' && editorState.topicId !== undefined) {
                    const data: CreatePostRequest = {
                        content: editorState.content,
                        reply: editorState.replyId,
                    }
                    const resp = await replyToTopic(editorState.topicId, data)
                    if (resp.success) {
                        toast.success("回复发布成功")
                    } else {
                        toast.error(resp.message || "回复发布失败")
                    }
                }
                editorStore.actions.closeEditor()
            } catch (error) {
                console.error("发布失败:", error)
                toast.error("发布失败")
            }
        },
    },
}

export default editorStore