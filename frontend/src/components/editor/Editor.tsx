import "./Editor.css"

import { For } from "solid-js"

import { useDraggable } from "@/hooks/useDraggable"
import editorStore from "@/store/editor"

const Editor = () => {
    const { handleMouseDown } = useDraggable()

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
                            <textarea
                                placeholder={
                                    editorStore.state.mode === "create"
                                        ? "输入话题内容..."
                                        : "输入回复内容..."
                                }
                                class="editor-textarea"
                                value={editorStore.state.content}
                                onInput={(e) =>
                                    editorStore.actions.setContent(
                                        e.target.value
                                    )
                                }
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
                            <div class="preview-content">
                                <For
                                    each={editorStore.state.content.split("\n")}
                                >
                                    {(line) => <p>{line}</p>}
                                </For>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Editor
