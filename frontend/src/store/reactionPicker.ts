import { makeTimer } from "@solid-primitives/timer"
import { createSignal } from "solid-js"

interface ReactionPickerState {
    isVisible: boolean
    position: { x: number; y: number } | null
    targetPost: { topicId: number; postNumber: number } | null
}

const [state, setState] = createSignal<ReactionPickerState>({
    isVisible: false,
    position: null,
    targetPost: null,
})

// timer disposer for hide timeout
let hideTimerDispose: (() => void) | undefined

const reactionPickerStore = {
    get state() {
        return state()
    },

    actions: {
        show(
            element: HTMLElement,
            topicId: number,
            postNumber: number
        ) {
            if (hideTimerDispose) {
                hideTimerDispose()
                hideTimerDispose = undefined
            }

            const rect = element.getBoundingClientRect()
            setState({
                isVisible: true,
                position: {
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                },
                targetPost: { topicId, postNumber },
            })
        },

        hide() {
            // schedule hiding after 200ms using makeTimer which returns a disposer
            hideTimerDispose = makeTimer(() => {
                setState({
                    isVisible: false,
                    position: null,
                    targetPost: null,
                })
            }, 200, setTimeout)
        },

        cancelHide() {
            if (hideTimerDispose) {
                hideTimerDispose()
                hideTimerDispose = undefined
            }
        },

        hideImmediately() {
            if (hideTimerDispose) {
                hideTimerDispose()
                hideTimerDispose = undefined
            }
            setState({
                isVisible: false,
                position: null,
                targetPost: null,
            })
        },
    },
}

export default reactionPickerStore
