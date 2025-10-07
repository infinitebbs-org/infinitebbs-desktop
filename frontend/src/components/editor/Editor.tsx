import "./Editor.css"

import { For,onCleanup,onMount } from "solid-js"

import editorStore from "@/store/editor"

const Editor = () => {
    let isDragging = false
    let startY = 0
    let startHeight = 0

    const handleMouseDown = (e: MouseEvent) => {
        isDragging = true
        startY = e.clientY
        startHeight = editorStore.state.height
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const newHeight = startHeight - (e.clientY - startY)
            editorStore.actions.setHeight(
                Math.max(240, Math.min(newHeight, window.innerHeight * 0.8))
            ) // 最小高度 240px，最大高度 80% 视口高度
        }
    }

    const handleMouseUp = () => {
        isDragging = false
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
    }

    onMount(() => {
        // 清理在组件卸载时
    })

    onCleanup(() => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
    })

    return (
        <>
            {editorStore.state.isOpen && (
                <div
                    class="editor-overlay"
                    style={{ height: editorStore.state.height + "px" }}
                >
                    <div
                        class="editor-handle"
                        onMouseDown={handleMouseDown}
                     />
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
                                <For each={editorStore.state.content
                                    .split("\n")}>{(line) => (
                                        <p>{line}</p>
                                    )}</For>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Editor
