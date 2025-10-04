import { createStore } from "solid-js/store"
import { createTopic, CreateTopicRequest } from "@/api/topic"
import toast from "solid-toast"

interface EditorState {
    isOpen: boolean
    title: string
    content: string
    height: number
}

const [editorState, setEditorState] = createStore<EditorState>({
    isOpen: false,
    title: "",
    content: "",
    height: 300,
})

const editorStore = {
    state: editorState,
    actions: {
        openEditor: () => setEditorState("isOpen", true),
        closeEditor: () => {
            setEditorState("isOpen", false)
            setEditorState("title", "")
            setEditorState("content", "")
        },
        setTitle: (title: string) => setEditorState("title", title),
        setContent: (content: string) => setEditorState("content", content),
        setHeight: (height: number) => setEditorState("height", height),
        publish: async () => {
            try {
                const data: CreateTopicRequest = {
                    title: editorState.title,
                    content: editorState.content,
                }
                const response = await createTopic(data)
                console.log("话题发布成功:", response)
                toast.success("话题发布成功")
                editorStore.actions.closeEditor()
            } catch (error) {
                console.error("发布话题失败:", error)
                toast.error("发布话题失败")
            }
        },
    },
}

export default editorStore