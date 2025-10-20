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

let hideTimerDispose: number

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
                window.clearTimeout(hideTimerDispose)
                hideTimerDispose = 0
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
            hideTimerDispose = window.setTimeout(() => {
                setState({
                    isVisible: false,
                    position: null,
                    targetPost: null,
                })
            }, 200);
        },

        cancelHide() {
            if (hideTimerDispose) {
                window.clearTimeout(hideTimerDispose)
                hideTimerDispose = 0
            }
        },

        hideImmediately() {
            if (hideTimerDispose) {
                window.clearTimeout(hideTimerDispose)
                hideTimerDispose = 0
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
