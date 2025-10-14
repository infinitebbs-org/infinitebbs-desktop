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

let hideTimeout: number | undefined

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
            if (hideTimeout) {
                clearTimeout(hideTimeout)
                hideTimeout = undefined
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
            hideTimeout = window.setTimeout(() => {
                setState({
                    isVisible: false,
                    position: null,
                    targetPost: null,
                })
            }, 200)
        },

        cancelHide() {
            if (hideTimeout) {
                clearTimeout(hideTimeout)
                hideTimeout = undefined
            }
        },

        hideImmediately() {
            if (hideTimeout) {
                clearTimeout(hideTimeout)
                hideTimeout = undefined
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
