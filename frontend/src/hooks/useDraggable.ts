import { onCleanup } from "solid-js"

import editorStore from "@/store/editor"

export const useDraggable = () => {
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
            )
        }
    }

    const handleMouseUp = () => {
        isDragging = false
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
    }

    onCleanup(() => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
    })

    return { handleMouseDown }
}