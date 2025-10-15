import { makeEventListener } from "@solid-primitives/event-listener"
import { onCleanup } from "solid-js"

import editorStore from "@/store/editor"

export const useDraggable = () => {
    let isDragging = false
    let startY = 0
    let startHeight = 0

    // disposers for listeners so we can remove them when not needed
    let disposeMouseMove: (() => void) | undefined
    let disposeMouseUp: (() => void) | undefined

    const handleMouseDown = (e: MouseEvent) => {
        isDragging = true
        startY = e.clientY
        startHeight = editorStore.state.height

        // use createEventListener which auto-cleans when scope is disposed,
        // but we also keep disposers to stop listeners once dragging finishes.
        disposeMouseMove = makeEventListener(document, "mousemove", (ev: MouseEvent) => {
            if (!isDragging) return
            const newHeight = startHeight - (ev.clientY - startY)
            editorStore.actions.setHeight(
                Math.max(240, Math.min(newHeight, window.innerHeight * 0.8))
            )
        })
        disposeMouseUp = makeEventListener(document, "mouseup", () => {
            isDragging = false
            if (disposeMouseMove) disposeMouseMove()
            if (disposeMouseUp) disposeMouseUp()
            disposeMouseMove = undefined
            disposeMouseUp = undefined
        })
    }

    onCleanup(() => {
        if (disposeMouseMove) disposeMouseMove()
        if (disposeMouseUp) disposeMouseUp()
    })

    return { handleMouseDown }
}