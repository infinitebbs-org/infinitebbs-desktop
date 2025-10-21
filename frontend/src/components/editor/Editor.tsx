import "./Editor.css"

import { markdown } from "@codemirror/lang-markdown"
import { Extension } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { useNavigate } from "@solidjs/router"
import { OverlayScrollbarsComponent } from "overlayscrollbars-solid"
import { createCodeMirror } from "solid-codemirror"
import { createEffect } from "solid-js"

import { useDraggable } from "@/hooks/useDraggable"
import editorStore from "@/store/editor"

import MarkdownContent from "../markdown/MarkdownContent"
import CategorySelector from "./CategorySelector"

const EDITOR_BASE_SETUP: Extension = []

const Editor = () => {
    const { handleMouseDown } = useDraggable()
    const navigate = useNavigate()

    const {
        editorView,
        ref: setRef,
        createExtension,
    } = createCodeMirror({
        value: editorStore.state.content,
        onValueChange: (value) => editorStore.actions.setContent(value),
    })

    // 基础主题配置
    const baseTheme = EditorView.theme({
        "&": {
            textAlign: "left",
            height: "100%",
        },
        ".cm-content": {
            textAlign: "left",
            padding: "8px 0",
            fontFamily:
                '"Maple Mono", "LXGW WenKai", Inter, Avenir, Helvetica, Arial, sans-serif',
        },
        ".cm-scroller": {
            overflow: "auto",
        },
        ".cm-line": {
            padding: "0 8px",
        },
        ".cm-cursor": {
            borderLeftWidth: "2px",
        },
    })

    // 添加扩展
    createExtension(EDITOR_BASE_SETUP)
    createExtension(markdown())
    createExtension(baseTheme)

    // 同步 editorView 到 store 以便外部访问
    createEffect(() => {
        if (editorView()) {
            console.log("CodeMirror editor initialized")
        }
    })

    // 当编辑器关闭时，清空 CodeMirror 的内容
    createEffect(() => {
        if (!editorStore.state.isOpen && editorView()) {
            editorView().dispatch({
                changes: {
                    from: 0,
                    to: editorView().state.doc.length,
                    insert: "",
                },
            })
        }
    })

    let metaRowRef

    return (
        <>
            <div
                class="editor-overlay"
                classList={{ open: editorStore.state.isOpen }}
                style={{ height: editorStore.state.height + "px" }}
            >
                <div
                    class="editor-handle no-select"
                    onMouseDown={handleMouseDown}
                >
                    <img
                        src="/ellipsis.svg"
                        alt="拖动手柄"
                        class="editor-handle-icon"
                    />
                </div>
                <div class="editor-content">
                    <div class="editor-input">
                        {editorStore.state.mode === "create" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="输入标题"
                                    class="editor-title"
                                    value={editorStore.state.title}
                                    onInput={(e) =>
                                        editorStore.actions.setTitle(
                                            e.target.value
                                        )
                                    }
                                />
                                <div class="editor-meta-row" ref={metaRowRef}>
                                    <CategorySelector
                                        value={editorStore.state.category}
                                        onChange={
                                            editorStore.actions.setCategory
                                        }
                                    />
                                    <div class="editor-meta-input-wrapper">
                                        <input
                                            type="text"
                                            placeholder="标签"
                                            class="editor-meta-input"
                                            value={editorStore.state.tags}
                                            onInput={(e) =>
                                                editorStore.actions.setTags(
                                                    e.target.value.split(",")
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        <div ref={setRef} class="editor-codemirror" />
                        <div class="editor-actions no-select">
                            <button
                                class="publish-btn"
                                onClick={async (e) => {
                                    const result =
                                        await editorStore.actions.publish()
                                    if (result.success && result.topicId) {
                                        e.currentTarget.blur()
                                        navigate(`/topic/${result.topicId}`)
                                    }
                                }}
                            >
                                {editorStore.state.mode === "create"
                                    ? "创建话题"
                                    : "回复"}
                            </button>
                            <button
                                class="cancel-btn"
                                onClick={(e) => {
                                    e.currentTarget.blur()
                                    editorStore.actions.closeEditor()
                                }}
                            >
                                舍弃
                            </button>
                        </div>
                    </div>
                    <div class="editor-preview">
                        <OverlayScrollbarsComponent defer>
                            <MarkdownContent
                                markdown={editorStore.state.content}
                            />
                        </OverlayScrollbarsComponent>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Editor
