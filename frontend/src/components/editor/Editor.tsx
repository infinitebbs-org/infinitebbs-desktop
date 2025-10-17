import "./Editor.css"

import { markdown } from "@codemirror/lang-markdown"
import { Extension } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { createCodeMirror } from "solid-codemirror"
import { createEffect } from "solid-js"

import { useDraggable } from "@/hooks/useDraggable"
import editorStore from "@/store/editor"

import MarkdownContent from "../markdown/MarkdownContent"

const EDITOR_BASE_SETUP: Extension = []

const Editor = () => {
    const { handleMouseDown } = useDraggable()

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

    return (
        <>
            {editorStore.state.isOpen && (
                <div
                    class="editor-overlay"
                    style={{ height: editorStore.state.height + "px" }}
                >
                    <div class="editor-handle" onMouseDown={handleMouseDown} />
                    <div class="editor-content">
                        <div class="editor-input">
                            {editorStore.state.mode === "create" && (
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
                            )}
                            <div
                                ref={setRef}
                                class="editor-codemirror"
                                style={{
                                    "min-height": "10px",
                                }}
                            />
                            <div class="editor-actions">
                                <button
                                    class="publish-btn"
                                    onClick={editorStore.actions.publish}
                                >
                                    {editorStore.state.mode === "create"
                                        ? "创建话题"
                                        : "回复"}
                                </button>
                                <button
                                    class="cancel-btn"
                                    onClick={editorStore.actions.closeEditor}
                                >
                                    舍弃
                                </button>
                            </div>
                        </div>
                        <div class="editor-preview">
                            <MarkdownContent
                                markdown={editorStore.state.content}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Editor
