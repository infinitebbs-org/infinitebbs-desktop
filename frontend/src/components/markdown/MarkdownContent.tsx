import "./MarkdownContent.css"

import { invoke } from "@tauri-apps/api/core"
import { createEffect, createSignal } from "solid-js"

interface MarkdownContentProps {
    /**
     * HTML 内容（已渲染的 HTML）
     * 与 markdown 二选一
     */
    html?: string
    /**
     * Markdown 纯文本
     * 与 html 二选一，如果提供则会调用后端转换为 HTML
     */
    markdown?: string
    /**
     * 自定义类名
     */
    class?: string
}

const MarkdownContent = (props: MarkdownContentProps) => {
    const [renderedHtml, setRenderedHtml] = createSignal("")

    createEffect(() => {
        if (props.html) {
            // 如果提供了 HTML，直接使用
            setRenderedHtml(props.html)
        } else if (props.markdown) {
            // 如果提供了 Markdown，调用后端转换
            invoke<string>("markdown_to_html", { markdown: props.markdown })
                .then((html) => setRenderedHtml(html))
                .catch((err) => {
                    console.error("Failed to parse markdown:", err)
                    setRenderedHtml("<p>Markdown 解析失败</p>")
                })
        } else {
            // 都没提供，显示空内容
            setRenderedHtml("")
        }
    })

    return (
        <div
            class={`markdown-content ${props.class || ""}`}
            innerHTML={renderedHtml()}
        />
    )
}

export default MarkdownContent
